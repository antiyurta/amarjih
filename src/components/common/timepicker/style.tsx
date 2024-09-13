import styled from 'styled-components';

const ContentWrapper = styled.div`
  .ant-picker {
    font-weight: bold !important;
    font-size: 14px;
    background-color: rgba(246, 246, 246) !important;
    border-radius: 4px !important;
    height: 35px !important;
  }
  .ant-picker-focused {
    border-color: #3b82f6 !important;
    box-shadow: none !important;
  }
  .ant-picker: hover {
    border-color: inherit !important;
    box-shadow: none !important;
  }
`;

export default ContentWrapper;
