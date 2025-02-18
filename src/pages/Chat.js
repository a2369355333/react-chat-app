import { useEffect, useState, useRef } from "react";
import { Avatar, TextField, Button, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageIcon from "@mui/icons-material/Image";
import MoodIcon from "@mui/icons-material/Mood";
import dataService from "../service/DataService";
import moment from "moment";
import MessageReaction from "../component/MessageReaction";
import { Emojione } from "react-emoji-render";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hoveredMsgIdx, setHoveredMsgIdx] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [image, setImage] = useState(null);
  const [currUser, setCurrUser] = useState({
    userId: 66,
    user: "Oreo",
    avatar: "https://i.pravatar.cc/150?img=66",
  });
  const lastMessageRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const d = await dataService.getConversations();
        const updatedConversations = d.map((conv) => {
          const updatedParticipants = conv.participants.some(
            (p) => p.userId === currUser.userId
          )
            ? conv.participants
            : [...conv.participants, currUser];

          return { ...conv, participants: updatedParticipants };
        });

        setConversations(updatedConversations);
      } catch (e) {
        console.error("Error fetching:", e);
      }
    };

    fetchConversations();
  }, []);

  const getMessages = async (conversation) => {
    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });

    setShowEmojis(false);
    setExpanded(false);
    const idx = conversation.id;
    const participants = conversation.participants;
    const d = await dataService.getMessages(idx);
    const groupInfo = {
      name: conversation.name,
      participants: participants,
      messages: d,
    };
    setGroupInfo(groupInfo);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !image) return;

    const newMessage = {
      conversationId: groupInfo.id,
      userId: 66,
      user: "Oreo",
      avatar: "https://i.pravatar.cc/150?img=66",
      messageType: image ? "image" : "text",
      message: image ? image : inputValue,
      reactions: { like: 0, love: 0, laugh: 0 },
      timestamp: Date.now(),
    };

    setGroupInfo((p) => ({
      ...p,
      messages: [...p.messages, newMessage],
    }));
    setInputValue("");
    setImage(null);

    try {
      const res = await dataService.postMessage(groupInfo.id, newMessage);
      console.log(res);
    } catch (e) {
      console.error("Failed to send message", e);
    }

    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 將圖片的 base64 字串儲存在狀態中
      };
      reader.readAsDataURL(file); // 將檔案轉換為 base64 格式
    }
    e.target.value = null;
  };

  const handleEmotionChoose = () => {
    if (!showEmojis) {
      const buttonRect = emojiButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: buttonRect.top + window.scrollY - 50,
        left: buttonRect.left + window.scrollX - 50,
      });
    }
    setShowEmojis(!showEmojis);
  };

  const handleReaction = (type) => {
    //not yet done
    setShowEmojis(false);
  };

  useEffect(() => {
    if (image) {
      handleSendMessage();
    }
  }, [image]);

  return (
    <div className="w-full h-screen flex">
      {/* 左側 Conversations 區域 */}
      <div className="w-2/12 h-full bg-[#4a3c8c] overflow-auto">
        {conversations.map((v, i) => (
          <div
            key={i}
            className="flex gap-3 py-10 pl-5 hover:bg-[#6a4b9a] transition-colors duration-300 cursor-pointer"
            onClick={() => getMessages(v)}
          >
            <Avatar
              alt="User Name"
              src={`https://robohash.org/${i}.png`}
              sx={{ width: 56, height: 56, border: "2px solid #fff" }}
            />
            <div className="w-full flex flex-col justify-center">
              <span className="text-2xl text-white font-bold">{v.name}</span>
              <span className="text-white">{v.lastMessage}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 右側 Chat 區域 */}
      <div className="w-10/12 h-screen flex flex-col bg-[#e8e0f1]">
        {Object.keys(groupInfo).length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="flex gap-3 text-5xl text-[#4a3c8c] font-bold">
              Welcome To Oreo's Big Family 
              <Emojione text=":heart:" />
            </span>
          </div>
        ) : (
          <>
            {/* 群組訊息區塊 */}
            <div
              className={`h-2/12 z-10 ${
                expanded ? "bg-white" : "bg-[#e8e0f1] opacity-90"
              }`}
            >
              {groupInfo.name && (
                <div className="relative">
                  <div className="px-5 py-2 flex items-center gap-2">
                    <span className="text-3xl">
                      {`${groupInfo.name} (${groupInfo.participants?.length})`}
                    </span>
                    <IconButton onClick={() => setExpanded(!expanded)}>
                      <ExpandMoreIcon
                        sx={{ fontSize: 40 }}
                        className={`transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </IconButton>
                  </div>
                  {/* 群組人員名單的 Collapse */}
                  {groupInfo.participants && expanded && (
                    <div className="px-5 pb-2 absolute top-full left-0 w-full z-10 bg-white">
                      <Collapse in={expanded}>
                        <div className="flex gap-2">
                          {groupInfo.participants.map((member, i) => (
                            <Avatar
                              key={i}
                              alt={member.user}
                              src={member.avatar}
                            />
                          ))}
                        </div>
                      </Collapse>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 顯示訊息區塊 */}
            <div className="flex-grow overflow-auto">
              <div className="flex flex-col gap-3 px-5 py-3">
                {groupInfo.messages &&
                  groupInfo.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-5 ${
                        msg.userId === 66 ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      {msg.userId !== 66 && (
                        <Avatar alt={msg.user} src={msg.avatar} />
                      )}
                      <div className="flex flex-col">
                        {msg.userId !== 66 && <span>{msg.user}</span>}
                        <div
                          className={`flex gap-2 items-end ${
                            msg.userId === 66 ? "justify-end" : "justify-start"
                          }`}
                          onMouseEnter={() => setHoveredMsgIdx(i)}
                          onMouseLeave={() => setHoveredMsgIdx(null)}
                        >
                          {msg.userId === 66 && (
                            <div>
                              {hoveredMsgIdx === i ? (
                                <IconButton
                                  ref={emojiButtonRef}
                                  onClick={() => handleEmotionChoose()}
                                >
                                  <MoodIcon />
                                </IconButton>
                              ) : (
                                moment(msg.timestamp).format(
                                  "YYYY/MM/DD A hh:mm"
                                )
                              )}
                            </div>
                          )}
                          <div
                            className={`p-2 rounded-lg max-w-xs break-words ${
                              msg.message.includes("data:image") ||
                              msg.message.startsWith("http")
                                ? ""
                                : msg.userId === 66
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-black"
                            }`}
                          >
                            {msg.message &&
                            (msg.message.includes("data:image") ||
                              msg.message.startsWith("http")) ? (
                              <div>
                                <img
                                  src={msg.message}
                                  alt="uploaded"
                                  className="max-w-full h-auto"
                                />
                              </div>
                            ) : (
                              msg.message
                            )}
                          </div>
                          {msg.userId !== 66 && (
                            <div>
                              {hoveredMsgIdx === i ? (
                                <IconButton
                                  ref={emojiButtonRef}
                                  onClick={handleEmotionChoose}
                                >
                                  <MoodIcon />
                                </IconButton>
                              ) : (
                                moment(msg.timestamp).format(
                                  "YYYY/MM/DD A hh:mm"
                                )
                              )}
                            </div>
                          )}

                          {/* 顯示表情框 */}
                          {showEmojis && (
                            <div
                              className="absolute bg-transparent z-50"
                              style={{
                                top: buttonPosition.top,
                                left: buttonPosition.left,
                              }}
                            >
                              <div className="flex">
                                <IconButton
                                  onClick={() => handleReaction("like")}
                                >
                                  <Emojione
                                    text=":thumbsup:"
                                    className="text-3xl"
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleReaction("love")}
                                >
                                  <Emojione
                                    text=":heart:"
                                    className="text-3xl"
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleReaction("laugh")}
                                >
                                  <Emojione
                                    text=":laughing:"
                                    className="text-3xl"
                                  />
                                </IconButton>
                              </div>
                            </div>
                          )}
                        </div>
                        <MessageReaction reactions={msg.reactions} />
                      </div>
                    </div>
                  ))}
                <div ref={lastMessageRef}></div>
              </div>
            </div>

            {/* 發送訊息區域 */}
            <div className="w-full h-4/12 relative">
              <TextField
                multiline={true}
                rows={5}
                variant="outlined"
                placeholder="Enter message..."
                fullWidth
                size="small"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  left: 10,
                  bottom: 10,
                }}
                onClick={() => document.getElementById("file-input").click()}
              >
                <ImageIcon sx={{ fontSize: 30 }} />
              </IconButton>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                }}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
