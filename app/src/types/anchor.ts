import { Idl } from '@coral-xyz/anchor';

export const IDL: Idl = {
  "version": "0.1.0",
  "name": "fee_predictor",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "feePredictor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [102, 101, 101, 95, 112, 114, 101, 100, 105, 99, 116, 111, 114] // "fee_predictor" in bytes
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "baseFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "predictFee",
      "accounts": [
        {
          "name": "feePredictor",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [102, 101, 101, 95, 112, 114, 101, 100, 105, 99, 116, 111, 114] // "fee_predictor" in bytes
              }
            ]
          }
        },
        {
          "name": "feePrediction",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [102, 101, 101, 95, 112, 114, 101, 100, 105, 99, 116, 105, 111, 110] // "fee_prediction" in bytes
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operationComplexity",
          "type": "u8"
        },
        {
          "name": "additionalAccounts",
          "type": "u8"
        },
        {
          "name": "dataLength",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateBaseFee",
      "accounts": [
        {
          "name": "feePredictor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [102, 101, 101, 95, 112, 114, 101, 100, 105, 99, 116, 111, 114] // "fee_predictor" in bytes
              }
            ]
          }
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newBaseFee",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "FeePrediction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "estimatedFee",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "predictedBy",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "FeePredictor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseFee",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "version",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidComplexity",
      "msg": "Operation complexity must be between 1 and 10"
    },
    {
      "code": 6001,
      "name": "TooManyAccounts",
      "msg": "Cannot specify more than 20 additional accounts"
    },
    {
      "code": 6002,
      "name": "DataTooLarge",
      "msg": "Data length cannot exceed 1024 bytes"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized: only admin can update base fee"
    },
    {
      "code": 6004,
      "name": "FeeTooLow",
      "msg": "Base fee must be at least 1000 lamports"
    }
  ],
  "events": [
    {
      "name": "FeeUpdated",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "newFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    }
  ]
};

export type FeePredictor = typeof IDL;