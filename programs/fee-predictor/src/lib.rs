use anchor_lang::prelude::*;

declare_id!("DjP1yyq8Aosrq9H7USJJtnVoTutHr94LGAUkaCuyUMp9");

// Define account structs first
#[account]
pub struct FeePredictor {
    pub base_fee: u64,
    pub bump: u8,
    pub admin: Pubkey,
    pub version: u8,
}

#[account]
pub struct FeePrediction {
    pub estimated_fee: u64,
    pub timestamp: i64,
    pub predicted_by: Pubkey,
}

// Define account contexts before the program
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 8 + 1 + 32 + 1,
        seeds = [b"fee_predictor"],
        bump
    )]
    pub fee_predictor: Account<'info, FeePredictor>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PredictFee<'info> {
    #[account(
        seeds = [b"fee_predictor"],
        bump = fee_predictor.bump,
    )]
    pub fee_predictor: Account<'info, FeePredictor>,
    #[account(
        init,
        payer = payer,
        space = 8 + 8 + 8 + 32,
        seeds = [b"fee_prediction", payer.key().as_ref()],
        bump
    )]
    pub fee_prediction: Account<'info, FeePrediction>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateBaseFee<'info> {
    #[account(
        mut,
        seeds = [b"fee_predictor"],
        bump = fee_predictor.bump,
        has_one = admin @ ErrorCode::Unauthorized
    )]
    pub fee_predictor: Account<'info, FeePredictor>,
    pub admin: Signer<'info>,
}

// Define error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Operation complexity must be between 1 and 10")]
    InvalidComplexity,
    #[msg("Cannot specify more than 20 additional accounts")]
    TooManyAccounts,
    #[msg("Data length cannot exceed 1024 bytes")]
    DataTooLarge,
    #[msg("Unauthorized: only admin can update base fee")]
    Unauthorized,
    #[msg("Base fee must be at least 1000 lamports")]
    FeeTooLow,
}

// Define event
#[event]
pub struct FeeUpdated {
    pub admin: Pubkey,
    pub old_fee: u64,
    pub new_fee: u64,
    pub timestamp: i64,
}

// Now define the program
#[program]
pub mod fee_predictor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, base_fee: u64) -> Result<()> {
        require!(base_fee >= 1000, ErrorCode::FeeTooLow);
        
        let fee_predictor = &mut ctx.accounts.fee_predictor;
        fee_predictor.base_fee = base_fee;
        fee_predictor.bump = ctx.bumps.fee_predictor;
        fee_predictor.admin = ctx.accounts.payer.key();
        fee_predictor.version = 1;
        Ok(())
    }

    pub fn predict_fee(
        ctx: Context<PredictFee>,
        operation_complexity: u8,
        additional_accounts: u8,
        data_length: u16,
    ) -> Result<()> {
        require!(
            operation_complexity >= 1 && operation_complexity <= 10,
            ErrorCode::InvalidComplexity
        );
        require!(
            additional_accounts <= 20,
            ErrorCode::TooManyAccounts
        );
        require!(
            data_length <= 1024,
            ErrorCode::DataTooLarge
        );

        let fee_predictor = &ctx.accounts.fee_predictor;
        
        let calculated_fee = fee_predictor.base_fee
            + (operation_complexity as u64).pow(2) * 50
            + (additional_accounts as u64) * 750
            + (data_length as u64) * 15;
        
        let prediction = &mut ctx.accounts.fee_prediction;
        prediction.estimated_fee = calculated_fee;
        prediction.timestamp = Clock::get()?.unix_timestamp;
        prediction.predicted_by = ctx.accounts.payer.key();
        
        Ok(())
    }

    pub fn update_base_fee(ctx: Context<UpdateBaseFee>, new_base_fee: u64) -> Result<()> {
        require!(new_base_fee >= 1000, ErrorCode::FeeTooLow);
        
        let old_fee = ctx.accounts.fee_predictor.base_fee;
        ctx.accounts.fee_predictor.base_fee = new_base_fee;
        
        emit!(FeeUpdated {
            admin: ctx.accounts.admin.key(),
            old_fee,
            new_fee: new_base_fee,
            timestamp: Clock::get()?.unix_timestamp
        });
        
        Ok(())
    }
}