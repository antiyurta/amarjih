import styled from 'styled-components';

const ContentWrapper = styled.div`
  .ant-table-cell {
    font-weight: bold !important
    color: #000000 !important;
    background-color: white !important;
    padding: 14px !important;
  }
  .ant-table-cell-row-hover {
    font-weight: bold !important
    color: #000000 !important;
    background-color: #f6f6f6 !important;
    padding: 14px !important;
  }
  .sidebar {
    position: fixed;
    width: 250px;
    height: 100vh;
    background-color: #001529;
    z-index: 1;
    top: 0;
    right: 0;
    color: white;
    animation-name: 'sidebar';
    animation-duration: 4s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    }
`;

export default ContentWrapper;
