/* eslint-disable react/prop-types */
function Message(props) {
  const styleName = props.type ? "sent" : "received";
  return <div className={"message " + styleName}>{props.content}</div>;
}

export default Message;
