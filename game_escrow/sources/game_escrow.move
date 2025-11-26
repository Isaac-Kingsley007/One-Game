module game_escrow::escrow;

use one::coin::{Self, Coin};
use one::oct::OCT;
use one::event;

// ===== Error Codes =====
const EInvalidAmount: u64 = 0;
const EGameNotReady: u64 = 1;
const EGameAlreadyFull: u64 = 2;
const EPlayerAlreadyJoined: u64 = 3;
const ENotGameParticipant: u64 = 4;
const EGameNotFinished: u64 = 5;
const EGameAlreadyFinished: u64 = 6;

// ===== Structs =====

/// Represents an active game escrow between two players
public struct GameEscrow has key {
    id: UID,
    /// Entry amount required per player
    entry_amount: u64,
    /// Address of player 1 (creator)
    player1: address,
    /// Address of player 2 (joiner) - optional until joined
    player2: Option<address>,
    /// Total OCT tokens held in escrow
    balance: Coin<OCT>,
    /// Game status: 0 = waiting, 1 = ready, 2 = finished
    status: u8,
    /// Winner address (set after game finishes)
    winner: Option<address>,
}

// ===== Events =====

public struct GameCreated has copy, drop {
    game_id: ID,
    creator: address,
    entry_amount: u64,
}

public struct PlayerJoined has copy, drop {
    game_id: ID,
    player: address,
}

public struct GameFinished has copy, drop {
    game_id: ID,
    winner: address,
    prize_amount: u64,
}

// ===== Public Functions =====

/// Create a new game escrow and deposit entry amount
public fun create_game(
    entry_payment: Coin<OCT>,
    entry_amount: u64,
    ctx: &mut TxContext
) {
    // Validate entry amount matches payment
    assert!(coin::value(&entry_payment) == entry_amount, EInvalidAmount);
    assert!(entry_amount > 0, EInvalidAmount);

    let sender = ctx.sender();
    
    let game = GameEscrow {
        id: object::new(ctx),
        entry_amount,
        player1: sender,
        player2: option::none(),
        balance: entry_payment,
        status: 0, // waiting for player 2
        winner: option::none(),
    };

    let game_id = object::id(&game);

    event::emit(GameCreated {
        game_id,
        creator: sender,
        entry_amount,
    });

    // Share the game object so others can join
    transfer::share_object(game);
}

/// Join an existing game by depositing the entry amount
public fun join_game(
    game: &mut GameEscrow,
    entry_payment: Coin<OCT>,
    ctx: &mut TxContext
) {
    let sender = ctx.sender();
    
    // Validate game state
    assert!(game.status == 0, EGameAlreadyFull);
    assert!(option::is_none(&game.player2), EGameAlreadyFull);
    assert!(sender != game.player1, EPlayerAlreadyJoined);
    
    // Validate payment amount
    assert!(coin::value(&entry_payment) == game.entry_amount, EInvalidAmount);

    // Add payment to escrow balance
    coin::join(&mut game.balance, entry_payment);
    
    // Set player 2 and update status
    game.player2 = option::some(sender);
    game.status = 1; // game ready

    event::emit(PlayerJoined {
        game_id: object::id(game),
        player: sender,
    });
}

/// Finish the game and transfer prize to winner
/// Can only be called by one of the game participants
public fun finish_game(
    game: &mut GameEscrow,
    winner_address: address,
    ctx: &mut TxContext
) {
    let sender = ctx.sender();
    
    // Validate caller is a game participant
    assert!(
        sender == game.player1 || 
        (option::is_some(&game.player2) && sender == *option::borrow(&game.player2)),
        ENotGameParticipant
    );
    
    // Validate game is ready and not finished
    assert!(game.status == 1, EGameNotReady);
    assert!(option::is_none(&game.winner), EGameAlreadyFinished);
    
    // Validate winner is one of the players
    assert!(
        winner_address == game.player1 || 
        (option::is_some(&game.player2) && winner_address == *option::borrow(&game.player2)),
        ENotGameParticipant
    );

    // Calculate prize amount
    let prize_amount = coin::value(&game.balance);
    
    // Extract all coins from escrow
    let prize = coin::split(&mut game.balance, prize_amount, ctx);
    
    // Update game state
    game.status = 2; // finished
    game.winner = option::some(winner_address);
    
    event::emit(GameFinished {
        game_id: object::id(game),
        winner: winner_address,
        prize_amount,
    });
    
    // Transfer prize to winner
    transfer::public_transfer(prize, winner_address);
}

/// Cancel game if player 2 hasn't joined yet
/// Returns entry amount to player 1
public fun cancel_game(
    game: GameEscrow,
    ctx: &mut TxContext
) {
    let sender = ctx.sender();
    
    // Only player 1 can cancel
    assert!(sender == game.player1, ENotGameParticipant);
    
    // Can only cancel if player 2 hasn't joined
    assert!(option::is_none(&game.player2), EGameAlreadyFull);
    
    let GameEscrow {
        id,
        entry_amount: _,
        player1,
        player2: _,
        balance,
        status: _,
        winner: _,
    } = game;
    
    // Return funds to player 1
    transfer::public_transfer(balance, player1);
    
    // Delete the game object
    object::delete(id);
}

// ===== View Functions =====

public fun get_entry_amount(game: &GameEscrow): u64 {
    game.entry_amount
}

public fun get_balance(game: &GameEscrow): u64 {
    coin::value(&game.balance)
}

public fun get_player1(game: &GameEscrow): address {
    game.player1
}

public fun get_player2(game: &GameEscrow): Option<address> {
    game.player2
}

public fun get_status(game: &GameEscrow): u8 {
    game.status
}

public fun get_winner(game: &GameEscrow): Option<address> {
    game.winner
}

public fun is_ready(game: &GameEscrow): bool {
    game.status == 1
}

public fun is_finished(game: &GameEscrow): bool {
    game.status == 2
}

// ===== Tests =====

#[test_only]
use one::test_scenario::{Self as ts, Scenario};

#[test_only]
const PLAYER1: address = @0xA11CE;
#[test_only]
const PLAYER2: address = @0xB0B;
#[test_only]
const ENTRY_AMOUNT: u64 = 1000;

#[test_only]
fun create_test_coin(amount: u64, scenario: &mut Scenario): Coin<OCT> {
    coin::mint_for_testing<OCT>(amount, ts::ctx(scenario))
}

#[test]
fun test_create_and_join_game() {
    let mut scenario = ts::begin(@0x0);
    
    // Player 1 creates game
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    // Player 2 joins game
    {
        ts::next_tx(&mut scenario, PLAYER2);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        
        // Verify game state
        assert!(is_ready(&game), 0);
        assert!(get_balance(&game) == ENTRY_AMOUNT * 2, 1);
        assert!(option::is_some(&get_player2(&game)), 2);
        
        ts::return_shared(game);
    };
    
    ts::end(scenario);
}

#[test]
fun test_finish_game_player1_wins() {
    let mut scenario = ts::begin(@0x0);
    
    // Create and setup game
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    {
        ts::next_tx(&mut scenario, PLAYER2);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        ts::return_shared(game);
    };
    
    // Finish game with player 1 as winner
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        finish_game(&mut game, PLAYER1, ts::ctx(&mut scenario));
        
        assert!(is_finished(&game), 0);
        assert!(option::is_some(&get_winner(&game)), 1);
        assert!(*option::borrow(&get_winner(&game)) == PLAYER1, 2);
        
        ts::return_shared(game);
    };
    
    // Verify player 1 received the prize
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let prize = ts::take_from_sender<Coin<OCT>>(&scenario);
        assert!(coin::value(&prize) == ENTRY_AMOUNT * 2, 3);
        ts::return_to_sender(&scenario, prize);
    };
    
    ts::end(scenario);
}

#[test]
fun test_cancel_game() {
    let mut scenario = ts::begin(@0x0);
    
    // Player 1 creates game
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    // Player 1 cancels before player 2 joins
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let game: GameEscrow = ts::take_shared(&scenario);
        cancel_game(game, ts::ctx(&mut scenario));
    };
    
    // Verify refund
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let refund = ts::take_from_sender<Coin<OCT>>(&scenario);
        assert!(coin::value(&refund) == ENTRY_AMOUNT, 0);
        ts::return_to_sender(&scenario, refund);
    };
    
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = EGameAlreadyFull)]
fun test_cannot_join_twice() {
    let mut scenario = ts::begin(@0x0);
    
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    {
        ts::next_tx(&mut scenario, PLAYER2);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        ts::return_shared(game);
    };
    
    // Try to join again - should fail
    {
        ts::next_tx(&mut scenario, @0xCAFE);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        ts::return_shared(game);
    };
    
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = EPlayerAlreadyJoined)]
fun test_creator_cannot_join_own_game() {
    let mut scenario = ts::begin(@0x0);
    
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    // Player 1 tries to join their own game - should fail
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        ts::return_shared(game);
    };
    
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = EInvalidAmount)]
fun test_wrong_entry_amount() {
    let mut scenario = ts::begin(@0x0);
    
    {
        ts::next_tx(&mut scenario, PLAYER1);
        let payment = create_test_coin(ENTRY_AMOUNT, &mut scenario);
        create_game(payment, ENTRY_AMOUNT, ts::ctx(&mut scenario));
    };
    
    // Try to join with wrong amount - should fail
    {
        ts::next_tx(&mut scenario, PLAYER2);
        let mut game: GameEscrow = ts::take_shared(&scenario);
        let payment = create_test_coin(ENTRY_AMOUNT - 100, &mut scenario);
        join_game(&mut game, payment, ts::ctx(&mut scenario));
        ts::return_shared(game);
    };
    
    ts::end(scenario);
}