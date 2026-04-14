import React, { Children, createContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Create Context
const TabsContext = createContext();

// A Custom Hook to use the Tabs Context
export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};

const defaultTabClass = "w-full";

const defaultNavWrapperClass =
  "flex  rounded overflow-hidden shadow-md transition-colors w-fit duration-300 border border-primary";
const defaultNavClass = "px-4 py-2 flex items-center gap-2";

const defaultActiveNavClass =
  "bg-primary text-white transition-colors duration-300  ";
const defaultInactiveNavClass = "bg-white transition-colors duration-300";
const defaultTabContentClass = "w-full mt-1 border border-light";

export default function Tabs({
  activeTab,
  setActiveTab,
  onTabChange,
  children,

  customNavWrapperClass,
  appendNavWrapperClasses,

  customNavClass,
  appendNavClasses,

  appendContentClasses,
  customContentClass,

  customClass,
  appendClasses,

  activeTabClass,
  inactiveTabClass,
}) {
  /* ========================= All States ========================= */
  const [tabsNavList, setTabsNavList] = useState([]);
  const [tabsContentList, setTabsContentList] = useState([]);
  const [afterTabContentList, setAfterTabContentList] = useState([]);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    // list of all children tab keys
    const tabKeys = Children.map(children, (child) => child.props.tabKey);
    setTabsNavList(tabKeys);
    const tabContents = Children.map(children, (child) => {
      return { key: child.props.tabKey, content: child.props.children };
    });
    setTabsContentList(tabContents);
    const afterTabContents = Children.map(children, (child) => {
      return {
        key: child.props.tabKey,
        content: child.props.afterTabContent,
      };
    });
    setAfterTabContentList(afterTabContents);
  }, [children]);

  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      <div
        className={`${customClass ? customClass : defaultTabClass} ${appendClasses}`}
      >
        {/*=======================================
            Nav Section    
        ========================================= */}
        <div
          className={`${
            customNavWrapperClass
              ? customNavWrapperClass
              : defaultNavWrapperClass
          } ${appendNavWrapperClasses}`}
        >
          {tabsNavList.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`${customNavClass ? customNavClass : defaultNavClass} ${appendNavClasses} ${
                activeTab === tabKey
                  ? activeTabClass || defaultActiveNavClass
                  : inactiveTabClass || defaultInactiveNavClass
              }`}
            >
              {tabKey}{" "}
              {afterTabContentList
                .find((item) => item.key === tabKey)
                ?.content(tabKey === activeTab)}
            </button>
          ))}
        </div>

        {/*=======================================
            Tab Content Section    
        ========================================= */}
        {tabsContentList.map((tab) => (
          <div
            key={tab.key}
            className={`${customContentClass ? customContentClass : defaultTabContentClass} ${appendContentClasses}`}
            style={{ display: activeTab === tab.key ? "block" : "none" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === tab.key ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              {tab.content}
            </motion.div>
          </div>
        ))}
      </div>
    </TabsContext>
  );
}

const Tab = ({ children, tabKey, customClass, appendClasses }) => {
  return (
    <div
      className={`${customClass ? customClass : defaultTabClass} ${appendClasses}`}
    >
      {children}
    </div>
  );
};

Tabs.tab = Tab;
