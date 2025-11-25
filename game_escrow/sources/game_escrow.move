module game_escrow::game_escrow {
    use one::coin::{self, Balance, Coin};
    use one::oct::OCT;
    use one::object::{self, UID};
    use one::tx_context::{self, TxContext};
    use one::transfer;
    use std::option::{self, Option};

    /// Error codes
    const E_ALREADY_JOINED: u64 = 0;
    const E_GAME_FULL: u64 = 1;
    const E_NOT_PARTICIPANT: u64 = 2;
    const E_GAME_NOT_READY: u64 = 3;
    const E_WINNER_ALREADY_PAID: u64 = 4;
    const E_INCORRECT_STAKE: u64 = 5;

    struct PlayerStake has store {
        addr: address,
        stake: Balance<OCT>,
    }

    public struct GameEscrow has key {
        id: UID,
        entry_fee: u64,
        player_one: Option<PlayerStake>,
        player_two: Option<PlayerStake>,
        winner_paid: bool,
    }

    /// Create a new shared escrow that will hold OCT stakes for a single match.
    public entry fun create_game(entry_fee: u64, ctx: &mut TxContext) {
        let escrow = new_game(entry_fee, ctx);
        transfer::public_share_object(escrow);
    }

    /// Join the game by locking the exact entry fee worth of OCT into escrow.
    public entry fun join_game(game: &mut GameEscrow, stake: Coin<OCT>, ctx: &mut TxContext) {
        join_internal(game, stake, tx_context::sender(ctx), ctx);
    }

    /// After the match concludes, the caller declares the winner and pays them the pot.
    public entry fun payout_winner(game: &mut GameEscrow, winner: address, ctx: &mut TxContext) {
        let payout_coin = payout_internal(game, winner, ctx);
        transfer::public_transfer(payout_coin, winner);
    }

    /// Construct a new escrow object (used by production code and tests).
    fun new_game(entry_fee: u64, ctx: &mut TxContext): GameEscrow {
        GameEscrow {
            id: object::new(ctx),
            entry_fee,
            player_one: option::none(),
            player_two: option::none(),
            winner_paid: false,
        }
    }

    /// Core join logic. Ensures a player cannot register twice and that the stake matches the entry fee.
    fun join_internal(game: &mut GameEscrow, stake: Coin<OCT>, sender: address, ctx: &mut TxContext) {
        assert!(!already_joined(game, sender), E_ALREADY_JOINED);
        assert!(coin::value(&stake) == game.entry_fee, E_INCORRECT_STAKE);

        let stake_balance = coin::into_balance(stake);
        if option::is_none(&game.player_one) {
            game.player_one = option::some(PlayerStake { addr: sender, stake: stake_balance });
            return;
        };

        if option::is_none(&game.player_two) {
            game.player_two = option::some(PlayerStake { addr: sender, stake: stake_balance });
            return;
        };

        abort E_GAME_FULL;
    }

    /// Core payout logic. Returns the winning coin so entry functions or tests can use it.
    fun payout_internal(game: &mut GameEscrow, winner: address, ctx: &mut TxContext): Coin<OCT> {
        assert!(!game.winner_paid, E_WINNER_ALREADY_PAID);
        assert!(both_players_joined(game), E_GAME_NOT_READY);

        let player_one = option::borrow(&game.player_one);
        let player_two = option::borrow(&game.player_two);

        let player_one_addr = player_one.addr;
        let player_two_addr = player_two.addr;

        let winner_is_player_one = winner == player_one_addr;
        let winner_is_player_two = winner == player_two_addr;
        assert!(winner_is_player_one || winner_is_player_two, E_NOT_PARTICIPANT);

        let stake_one = option::extract(&mut game.player_one).stake;
        let stake_two = option::extract(&mut game.player_two).stake;

        let mut payout_coin = coin::from_balance(stake_one, ctx);
        let second_coin = coin::from_balance(stake_two, ctx);
        coin::merge(&mut payout_coin, second_coin);

        game.winner_paid = true;

        // Clear the losing slot as well for safety (already extracted, but leave explicit None)
        game.player_one = option::none();
        game.player_two = option::none();

        payout_coin
    }

    fun already_joined(game: &GameEscrow, addr: address): bool {
        slot_matches(&game.player_one, addr) || slot_matches(&game.player_two, addr)
    }

    fun both_players_joined(game: &GameEscrow): bool {
        option::is_some(&game.player_one) && option::is_some(&game.player_two)
    }

    fun slot_matches(slot: &Option<PlayerStake>, addr: address): bool {
        if (option::is_some(slot)) {
            option::borrow(slot).addr == addr
        } else {
            false
        }
    }

    /// === Test helpers ===
    #[test_only]
    public fun new_for_testing(entry_fee: u64, ctx: &mut TxContext): GameEscrow {
        new_game(entry_fee, ctx)
    }

    #[test_only]
    public fun join_for_testing(game: &mut GameEscrow, stake: Coin<OCT>, player: address, ctx: &mut TxContext) {
        join_internal(game, stake, player, ctx);
    }

    #[test_only]
    public fun payout_for_testing(game: &mut GameEscrow, winner: address, ctx: &mut TxContext): Coin<OCT> {
        payout_internal(game, winner, ctx)
    }
}
