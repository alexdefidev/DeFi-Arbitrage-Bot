from solana.keypair import Keypair
from solana.rpc.async_api import AsyncClient
import base58

async def create_wallet() -> dict:
    """Generate a new Solana keypair."""
    keypair = Keypair()
    return {
        "public_key": str(keypair.public_key),
        "private_key": base58.b58encode(keypair.secret_key).decode()
    }

async def get_balance(rpc_endpoint: str, public_key: str) -> float:
    """Fetch wallet balance in SOL."""
    client = AsyncClient(rpc_endpoint)
    response = await client.get_balance(public_key)
    balance = response['result']['value'] / 1_000_000_000  # Convert lamports to SOL
    return balance

async def validate_private_key(private_key: str) -> bool:
    """Validate Base58-encoded private key."""
    try:
        base58.b58decode(private_key)
        return True
    except Exception:
        return False
