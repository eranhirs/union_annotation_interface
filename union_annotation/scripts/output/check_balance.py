from union_annotation.scripts.utils import create_client

mtc = create_client()

print(f"Available Balance: {mtc.get_account_balance()['AvailableBalance']}")
