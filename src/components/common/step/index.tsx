import React, { useEffect, useState } from 'react';

const CustomStep = ({ steps }) => {
  const renderSteps = steps => {
    return steps.map((step, index) => (
      <div key={index} className="step">
        <div className="step-content">
          <div className="step-index">{index + 1}</div>
          <div className="step-title">{step.name}</div>
        </div>
        {step.children && <div className="step-children">{renderSteps(step.children)}</div>}
      </div>
    ));
  };

  return <div className="custom-steps">{renderSteps(steps)}</div>;
};

const CustomSteps = ({ columns }) => {
  function buildTree(items, parentId = null) {
    const result = [];
    items.forEach(item => {
      if (item.parentId === parentId) {
        const children = buildTree(items, item.id);
        if (children.length) {
          item.children = children;
        }
        result.push(item);
      }
    });
    return result;
  }

  // Building the tree
  const tree = buildTree(columns);
  return <CustomStep steps={tree} />;
};

export default CustomSteps;
