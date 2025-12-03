import hashlib

def hash_data(data):
    """Hash data using SHA-256."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()

def merkle_root(leaves):
    """Build Merkle Tree and return the root hash."""
    level = [hash_data(leaf) for leaf in leaves]

    while len(level) > 1:
        new_level = []
        if len(level) % 2 == 1:
            level.append(level[-1])

        for i in range(0, len(level), 2):
            combined = level[i] + level[i + 1]
            new_level.append(hash_data(combined))
        
        level = new_level

    return level[0]

if __name__ == "__main__":
    transactions = ["tx1", "tx2", "tx3", "tx4"]
    print("Merkle Root:", merkle_root(transactions))