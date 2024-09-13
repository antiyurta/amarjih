import styled from 'styled-components';

const ContentWrapper = styled.div`
  .ant-select {
    // font-weight: bold !important;
    border-radius: 4px !important;
  }

  .ant-select-selector {
    width: 240px !important;
    border: none !important;
    background-color: rgba(246, 246, 246) !important;
    height: 35px !important;
    border-radius: 4px !important;
    align-items: center !important;
    border-color: inherit !important;
    box-shadow: none !important;
  }
  .ant-select-open {
    border-color: inherit !important;
    box-shadow: none !important;
  }
  .ant-select:hover {
    border-color: inherit !important;
    box-shadow: none !important;
  }
  .ant-select-selection-placeholder {
    font-size: 12px;
  }
`;

export default ContentWrapper;
