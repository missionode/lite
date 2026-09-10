"""Static policy wiring checks, not evidence of real agent compliance or savings."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class EfficiencyContract(unittest.TestCase):
    def test_entry_points_reference_companion(self):
        for name in ("loop.md", "DELIVERY-WORKFLOW.md", "MODEL-ROUTING.md", "skills/loop/SKILL.md"):
            with self.subTest(name=name):
                self.assertIn("EFFICIENT-WORKFLOW.md", (ROOT / name).read_text())
        self.assertIn("Loop/EFFICIENT-WORKFLOW.md", (ROOT.parent / "AGENTS.md").read_text())

    def test_safety_and_truth_boundaries_remain_explicit(self):
        policy = (ROOT / "EFFICIENT-WORKFLOW.md").read_text()
        for requirement in (
            "PLANNED", "not executed", "parent model remains unchanged",
            "explicit user-selected model", "human-switch checkpoint",
            "Browser use remains opt-in", "No secrets", "append-only archive",
            "New/untriaged failures block", "not increased", "do not create one without",
            "not push, deploy, fetch", "preserve", "Installation boundary",
        ):
            with self.subTest(requirement=requirement):
                self.assertIn(requirement, policy)

    def test_followups_not_misrepresented_as_delivery(self):
        policy = (ROOT / "EFFICIENT-WORKFLOW.md").read_text()
        self.assertIn("bounded follow-up tasks", policy)
        self.assertIn("before claiming a cost improvement", policy)


if __name__ == "__main__":
    unittest.main()
