import random

# Node class for Skip List
class Node:
    def __init__(self, value, level):
        # Each node holds a value
        self.value = value
        # 'forward' is a list of pointers to the next nodes at different levels
        # Example: forward[0] is the next node in level 0 (the bottom level)
        self.forward = [None] * (level + 1)

# SkipList class
class SkipList:
    def __init__(self, max_level, p):
        # max_level defines how tall the skip list can be
        self.MAXLVL = max_level
        # p is the probability used to determine node level (usually 0.5)
        self.P = p
        # Header node is the starting node of the skip list (contains no real value)
        self.header = self._create_node(self.MAXLVL, -1)
        # Current level of skip list (starts at 0)
        self.level = 0

    # Helper to create a node with a given value and level
    def _create_node(self, lvl, value):
        return Node(value, lvl)

    # Randomly generate a level for a new node based on probability p
    def random_level(self):
        lvl = 0
        # Increase level while random() < p and lvl < MAXLVL
        while random.random() < self.P and lvl < self.MAXLVL:
            lvl += 1
        return lvl

    # Insert a value into the skip list
    def insert(self, value):
        # 'update' keeps track of the last node at each level before insertion point
        update = [None] * (self.MAXLVL + 1)
        current = self.header

        # Start from the top level and move down to level 0
        for i in range(self.level, -1, -1):
            # Move forward while next node’s value is smaller than the value to insert
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
            update[i] = current

        # Move to level 0 to actually insert the new node
        current = current.forward[0]

        # Only insert if the value doesn’t already exist
        if current is None or current.value != value:
            # Randomly determine level for new node
            new_level = self.random_level()

            # If new level is greater than current skip list level, update header links
            if new_level > self.level:
                for i in range(self.level + 1, new_level + 1):
                    update[i] = self.header
                self.level = new_level

            # Create the new node
            n = self._create_node(new_level, value)

            # Reconnect forward pointers at each level
            for i in range(new_level + 1):
                n.forward[i] = update[i].forward[i]
                update[i].forward[i] = n

    # Search for a value in the skip list
    def search(self, value):
        current = self.header
        # Start from the top level and go down
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
        current = current.forward[0]

        # Return True if value found, False otherwise
        if current and current.value == value:
            return True
        return False

    # Print the skip list levels for visualization
    def display_list(self):
        print("\n***** Skip List *****")
        for lvl in range(self.level + 1):
            print("Level {}: ".format(lvl), end=" ")
            node = self.header.forward[lvl]
            while node is not None:
                print(node.value, end=" ")
                node = node.forward[lvl]
            print("")


# Example usage
if __name__ == "__main__":
    # Create a skip list with max 3 levels and p = 0.5
    lst = SkipList(3, 0.5)

    # Insert some values
    lst.insert(3)
    lst.insert(6)
    lst.insert(7)
    lst.insert(9)
    lst.insert(12)
    lst.insert(19)
    lst.insert(17)
    lst.insert(26)
    lst.insert(21)
    lst.insert(25)

    # Print the skip list
    lst.display_list()

    # Search for some values
    print("\nSearching for 19:", lst.search(19))  # Found → True
    print("Searching for 15:", lst.search(15))    # Not found → False
