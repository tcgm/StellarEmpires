import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { NationData } from "../types";
import NationView from "./NationView";

interface Props {
  nations: NationData[];
}

const NationTabs: React.FC<Props> = ({ nations }) => {
  if (!nations.length) return <div>No nation data loaded.</div>;

  return (
    <Tabs variant="enclosed" colorScheme="blue" isLazy>
      <TabList>
        {nations.map((nation) => (
          <Tab key={nation.nation}>{nation.nation}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {nations.map((nation) => (
          <TabPanel key={nation.nation}>
            {/* <NationView data={nation} /> */}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default NationTabs;
