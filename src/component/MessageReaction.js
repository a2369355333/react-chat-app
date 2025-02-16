import { Emojione } from "react-emoji-render";

const getEmotions = (reactions) => {
    const reactionItems = [];
  
    if (reactions.like > 0) {
      reactionItems.push(
        <span key="like" className="flex items-center gap-1">
          <Emojione text=":thumbsup:" /> {reactions.like}
        </span>
      );
    }
    if (reactions.love > 0) {
      reactionItems.push(
        <span key="love" className="flex items-center gap-1">
          <Emojione text=":heart:" /> {reactions.love}
        </span>
      );
    }
    if (reactions.laugh > 0) {
      reactionItems.push(
        <span key="laugh" className="flex items-center gap-1">
          <Emojione text=":laughing:" /> {reactions.laugh}
        </span>
      );
    }
  
    return reactionItems;
  };

const MessageReaction = (props) => {
    const { reactions } = props;
    return (
        <div className="flex gap-2">
            {getEmotions(reactions)}
        </div>
    );
}

export default MessageReaction;