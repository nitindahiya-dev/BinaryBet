use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash;

declare_id!("BHEAFrDV85GnGzuJDqR7xEujEptbAwxHZuPT76QDqtTk");



#[program]
pub mod binarybet {
    use super::*;

    pub fn place_bet(ctx: Context<PlaceBet>, bet: Bet) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let platform_fee = 2; // 2% fee on winning bets

        // Ensure bet amount is within allowed range (in lamports, adjust conversion as needed)
        require!(bet.amount >= 1_000, CustomError::InvalidBetAmount);      // Minimum bet: 0.000001 SOL (assuming 1 SOL = 1e9 lamports)
        require!(bet.amount <= 1_000_000_000, CustomError::InvalidBetAmount); // Maximum bet: 1 SOL

        // Calculate fee (only on winnings)
        let fee_amount = bet.amount * platform_fee / 100;
        let final_wager = bet.amount - fee_amount;

        // Determine outcome using a pseudo-random number generator based on block timestamp
        let hash_val = hash(ctx.accounts.clock.unix_timestamp.to_string().as_bytes());
        let is_even = hash_val.to_bytes()[0] % 2 == 0;

        if is_even == bet.prediction_is_even {
            // Winning bet: payout at 1.95x wager (minus fee)
            user_account.balance += (final_wager * 195 / 100);
        } else {
            // Losing bet: wager is deducted
            user_account.balance -= final_wager;
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
    // The clock is used to simulate RNG based on current time
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct UserAccount {
    pub balance: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Bet {
    pub amount: u64,
    pub prediction_is_even: bool,
}

#[error_code]
pub enum CustomError {
    #[msg("The bet amount is invalid.")]
    InvalidBetAmount,
}
