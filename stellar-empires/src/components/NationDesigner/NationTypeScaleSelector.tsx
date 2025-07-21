import React from "react";
import { Box, Select, HStack, Text, Tag, Tooltip } from "@chakra-ui/react";
import { NationData, ScaleType } from "../../types";

interface NationTypeScaleSelectorProps {
  nations: NationData[];
  nationType: string;
  scale: ScaleType;
  onChangeNation: (nationType: string) => void;
  onChangeScale: (scale: ScaleType) => void;
  points: { CT: number; NT: number; CF: number; NF: number };
}

const NationTypeScaleSelector: React.FC<NationTypeScaleSelectorProps> = ({
  nations, nationType, scale, onChangeNation, onChangeScale, points
}) => (
  <Box>
    <HStack spacing={6}>
      <HStack>
        <Text fontWeight="bold">Type</Text>
        <Select value={nationType} onChange={e => onChangeNation(e.target.value)} width="220px">
          <option value="">-- Select Nation Type --</option>
          {nations.map(n => (
            <option key={n.nation} value={n.nation}>{n.nation}</option>
          ))}
        </Select>
      </HStack>
      <HStack>
        <Text fontWeight="bold">Scale</Text>
        <Select value={scale} onChange={e => onChangeScale(e.target.value as ScaleType)} width="140px">
          <option value="Wide">Wide</option>
          <option value="Tall">Tall</option>
          <option value="Balanced">Balanced</option>
        </Select>
      </HStack>
      <Box>
        <Text fontWeight="bold">Points</Text>
        <HStack>
          <Tooltip label="Common Trait Points">
            <Tag colorScheme="green">CT {points.CT}</Tag>
          </Tooltip>
          <Tooltip label="Common Flaw Points">
            <Tag colorScheme="orange">CF {points.CF}</Tag>
          </Tooltip>
          <Tooltip label="Nation Trait Points">
            <Tag colorScheme="lightblue">NT {points.NT}</Tag>
          </Tooltip>
          <Tooltip label="Nation Flaw Points">
            <Tag colorScheme="red">NF {points.NF}</Tag>
          </Tooltip>
        </HStack>
      </Box>
    </HStack>
  </Box>
);

export default NationTypeScaleSelector;
