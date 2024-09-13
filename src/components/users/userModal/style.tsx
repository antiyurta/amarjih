import styled from 'styled-components';

const ContentWrapper = styled.div`
  .ant-input {
    padding: 0.5rem;
    border: none;
    background-color: #f1f2f6;
    color: #0a3761;
    font-size: 1rem;
    border-radius: 0.5rem;
  }

  .ant-form-item-has-error .ant-input {
    background-color: #f1f2f6 !important;
  }

  .ant-modal-title {
    color: #0a3761 !important;
  }
  .ant-input-password {
    background-color: #f1f2f6;
    padding: 0.5rem;
    border: none;
    background-color: #f1f2f6;
    color: #0a3761;
    font-size: 1rem;
    border-radius: 0.5rem;
  }
  .ant-input-affix-wrapper .ant-input-password {
    background-color: #f1f2f6 !important;
  }
`;

export default ContentWrapper;
