import enum

class AnomalyType(enum.Enum):
    NORMAL= 0
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    FATAL = 4