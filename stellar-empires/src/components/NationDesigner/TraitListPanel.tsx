import React from "react";
import TraitBox from "../TraitBox";
import { TraitOrFlaw } from "../../types";

interface TraitListPanelProps {
  title: string;
  traits: TraitOrFlaw[];
  selected: string[];
  onToggle: (trait: TraitOrFlaw) => void;
  isTrait: boolean;
  color: string;
  max?: number;
}

const TraitListPanel: React.FC<TraitListPanelProps> = ({
  title, traits, selected, onToggle, isTrait, color, max
}) => (
  <div>
    <strong>
      {title} ({selected.length}{typeof max === "number" ? "/" + max : ""})
    </strong>
    {traits.map(trait => (
      <div key={trait.title} onClick={() => onToggle(trait)} style={{ cursor: "pointer" }}>
        <TraitBox
          title={trait.title}
          description={trait.description}
          points={trait.points}
          isTrait={isTrait}
          showTypeBadge
          showPointsBadge
          boxBg={selected.includes(trait.title) ? color : undefined}
          boxBorder={selected.includes(trait.title) ? "blue.400" : "gray.300"}
        />
      </div>
    ))}
  </div>
);

export default TraitListPanel;
