#[test_only]
module game_escrow::game_escrow_tests {
    use game_escrow::game_escrow;
    use one::coin;
    use one::oct::OCT;
    use one::tx_context;

    /// Happy path: two players join and the declared winner receives the combined stake.
    #[test]
    fun test_join_and_payout() {
        let mut ctx = tx_context::dummy();
        let mut escrow = game_escrow::new_for_testing(100, &mut ctx);

        let p1_stake = coin::mint_for_testing<OCT>(100, &mut ctx);
        let p2_stake = coin::mint_for_testing<OCT>(100, &mut ctx);

        game_escrow::join_for_testing(&mut escrow, p1_stake, @0x1, &mut ctx);
        game_escrow::join_for_testing(&mut escrow, p2_stake, @0x2, &mut ctx);

        let payout = game_escrow::payout_for_testing(&mut escrow, @0x1, &mut ctx);
        assert!(coin::value(&payout) == 200, 0);
        coin::burn_for_testing(payout);
    }

    /// Only registered players can receive the winnings.
    #[test, expected_failure(abort_code = ::game_escrow::game_escrow::E_NOT_PARTICIPANT)]
    fun test_non_participant_cannot_claim() {
        let mut ctx = tx_context::dummy();
        let mut escrow = game_escrow::new_for_testing(10, &mut ctx);

        let p1_stake = coin::mint_for_testing<OCT>(10, &mut ctx);
        let p2_stake = coin::mint_for_testing<OCT>(10, &mut ctx);

        game_escrow::join_for_testing(&mut escrow, p1_stake, @0x1, &mut ctx);
        game_escrow::join_for_testing(&mut escrow, p2_stake, @0x2, &mut ctx);

        let _ = game_escrow::payout_for_testing(&mut escrow, @0x3, &mut ctx);
    }
}
