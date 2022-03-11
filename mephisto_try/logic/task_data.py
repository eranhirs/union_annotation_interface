from dataclasses import dataclass


@dataclass
class TaskData:
    sentence1Text: str
    sentence2Text: str


@dataclass
class Example(TaskData):
    exampleTitle: str
    step2Extra: str
    step3Extra: str
    step4Extra: str
    mergedSentenceText: str
