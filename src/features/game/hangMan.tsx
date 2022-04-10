import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./hangMan.module.css";
import { Button } from "../../components/Button.styled";
import ModelCamera from "../../components/ModelCamera/ModelCamera";
import { Alphabet, easyWords, mediumWords, hardWords } from "../../types/Models";
import LetterSpelled from "../../types/LetterSpelled";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { getGameAsync, postScoreAsync, selectGame } from "./gameSlice";
import { Game } from "../../types/Game";
import { selectSignIn, selectUser } from "../signin/signinSlice";
import { scorePost } from "../../types/Score";
import Figure from "./HM_components/figure"
import WrongSection from "./HM_components/WrongSection";

const HangMan: FunctionComponent = () =>{
    Modal.setAppElement("body");
  const [buffer, setBuffer] = useState<String[]>([]);
  const [bufferFlag, setBufferFlag] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState<number>(10);
  const [isTimerPaused, setIsTimerPaused] = useState(true);
  const [lettersSpelled, setLettersSpelled] = useState<LetterSpelled[]>([]);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(true);
  const [isScorePosted, setIsScorePosted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const user = useSelector(selectUser);
  const isAuthorized = useSelector(selectSignIn);
  const dispatch = useDispatch();
  //@ts-ignore
  const game: Game = useSelector(selectGame).game;
  const navigate = useNavigate();

  //hangMan States
  const [currentWord, setCurrentWord] = useState<String>(
      easyWords[Math.floor(Math.random()*easyWords.length - 1)]
  )
  const [wrongLetters, setWrongLetters] = useState<Array<String>>([]);
  const[correctLetters, setCorrectLetters] = useState<Array<String>>([]);


  const renderWord = (word:String) => {
      return (
          <div>
            {word.split('').map((letter, i) =>
                <span className={styles.letter} key={i}>
                    {correctLetters.includes(letter) ? letter: ''} 
                </span>
            )}
          </div>
          
      )
  }

  const renderModal = () => {
    if (game) {
      return (
        <div className={styles.word}>
          <h2>Rules</h2>
          <p>{game.rules}</p>
          <br />
          <h2>Description</h2>
          <p>{game.description}</p>
          <button
            className={styles.backButton}
            style={{ marginTop: "20%" }}
            onClick={() => {
              setIsModalOpen(false);
              setIsTimerPaused(false);
            }}
          >
            Start Playing!
          </button>
        </div>
      );
    }
  };

  const updateBuffer = (value: String) => {
    let bufferList = buffer;

    if (buffer.length === 20) {
      bufferList.shift();
      bufferList.push(value);
      setBuffer(bufferList);
      setBufferFlag((prev) => {
        return !prev;
      });
    } else {
      bufferList.push(value);
      setBuffer(bufferList);
    }
  };

  const checkInputLetter = () =>{
    if(buffer.length < 20){
      return null;
    }
    let modeMap = new Map();
    let maxEl: String = buffer[0];
    let maxCount:number = 1;
    for(let i = 0; i < buffer.length; i++){

      let element:String = buffer[i];

      if(modeMap.has(element)){
        modeMap.set(element, modeMap.get(element) + 1);
      }else{
        modeMap.set(element, 1);
      }
      if(modeMap.get(element) > maxCount){
        maxEl = element;
        maxCount = modeMap.get(element);
      }
    }
    return maxEl;
  }

  useEffect(() =>{
    let inputLetter: string | null = checkInputLetter() as string;
    if (inputLetter !== null){
      if(currentWord.includes(inputLetter)){
        if(!correctLetters.includes(inputLetter)){
          setCorrectLetters([...correctLetters, inputLetter]);
        }
      }else{
        if(!wrongLetters.includes(inputLetter)){
          setWrongLetters([...wrongLetters, inputLetter]);
        }
      }
    }
  }, [bufferFlag]);
  
  return (
      <>
      <div className={styles.background + ' ' + styles.layer1}>
        <section id='container' className={styles.container}>
            <div className={styles.left}>
                <div className={styles.topGameBar}>
                    <button
                    style={{marginRight:'30px'}}
                    onClick={() => {
                        navigate('../');
                        window.location.reload();
                    }}
                    className={styles.backButton}>
                        &#8249;
                    </button>
                    <h1 style={{ alignSelf: "" }}>HangMan</h1>
                </div>
                <ModelCamera
                    onUserMedia={setIsCameraLoading}
                    updateGameBuffer={updateBuffer}
                ></ModelCamera>
            </div>
            <div className={styles.right}>
                <div className={styles.gameboard}>
                    <div className={styles.letters}>
                        {renderWord(currentWord)}
                    </div>
                    <hr className={styles.divider}></hr>
                    <div>
                      <Figure wrong={wrongLetters} />
                    </div>
                    <hr className={styles.divider}></hr>
                    <WrongSection wrong={wrongLetters} />

                </div>
            </div>
        </section>

          
      </div>
      </>
  )

}

export default HangMan