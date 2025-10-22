import hashlib

# helper function to hash data using SHA-256 (takes any input data (a file, text, transaction, etc.) and produces a fixed-length 256-bit (64-character hexadecimal) hash.)
def hash_data(data):
    if isinstance(data, str): # if it is a string
        data = data.encode('utf-8') # encode it into bytes
    return hashlib.sha256(data).hexdigest() # return the hexadecimal string

# build Merkle Tree and return the root hash from a list of data blocks
def merkle_root(leaves):
    # Hash all leaves (data blocks)
    level = [hash_data(leaf) for leaf in leaves]

    # go until only one is left / combining and hashing pairs until only one hash remains
    while len(level) > 1:
        new_level = [] # hold the next level

        # if odd number of nodes dup last node / make sure there is always something to combine with
        if len(level) % 2 == 1:
            level.append(level[-1])

        # hash pairs of nodes together
        for i in range(0, len(level), 2):
            combined = level[i] + level[i + 1] # combine hashes
            new_level.append(hash_data(combined))# get the parent node and add the parent hash to the next level

        # move up one level
        level = new_level

    # return final (merkle root) hash
    return level[0]

# Example usage
if __name__ == "__main__":
    # Example leaves
    transactions = ["tx1", "tx2", "tx3", "tx4"]

    root = merkle_root(transactions) # build the tree
    print("Merkle Root:", root) # print result
