import random

# Node class for Skip List
class Node:
    def __init__(self, value, level):
        self.value = value
        self.forward = [None] * (level + 1)

class SkipList:
    def __init__(self, max_level, p):
        self.MAXLVL = max_level
        self.P = p
        self.header = self._create_node(self.MAXLVL, -1)
        self.level = 0

    def _create_node(self, lvl, value):
        return Node(value, lvl)

    def random_level(self):
        lvl = 0
        while random.random() < self.P and lvl < self.MAXLVL:
            lvl += 1
        return lvl

    def insert(self, value):
        update = [None] * (self.MAXLVL + 1)
        current = self.header

        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
            update[i] = current

        current = current.forward[0]

        if current is None or current.value != value:
            new_level = self.random_level()

            if new_level > self.level:
                for i in range(self.level + 1, new_level + 1):
                    update[i] = self.header
                self.level = new_level

            n = self._create_node(new_level, value)

            for i in range(new_level + 1):
                n.forward[i] = update[i].forward[i]
                update[i].forward[i] = n

    def search(self, value):
        current = self.header
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
        current = current.forward[0]

        if current and current.value == value:
            return True
        return False


# persistent skip list instance
BLOCK_INDEX = SkipList(max_level=10, p=0.5)

# updates the index
def update_skip_list(block_height, merkle_root):
    """ Called by BlockSerializer.create() to insert the new block's height into the Skip List index for fast lookups. """
    BLOCK_INDEX.insert(block_height)
    print(f"SkipList Manager: Indexed Block #{block_height}. Root: {merkle_root[:10]}...")

# Example: A helper function for search functionality
def check_block_height_existence(height):
    """ O(log n) lookup time for now before using bloom filter which will be theoretical O(k)"""
    return BLOCK_INDEX.search(height)