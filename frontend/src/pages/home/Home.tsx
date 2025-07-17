import React from 'react'
import {
    RobotFilled,
    FileTextOutlined,
    LikeOutlined,
    DatabaseOutlined,
    RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
    S_HomeContent,
    S_HomeWrapper,
    S_HomeTitle,
    S_HomeMenuWrapper,
    S_HomeMenu,
} from './Home.style'

const Home = () => {
    const navigate = useNavigate()

    const handleClickPrompt = () => {
        navigate('/prompt')
    }

    const handleClickEvaluation = () => {
        navigate('/evaluation')
    }

    const handleClickData = () => {
        navigate('/datasets')
    }

    return (
        <S_HomeWrapper>
            <S_HomeContent>
                <S_HomeTitle>
                    <RobotFilled /> &nbsp;AI PROMPT MANAGER
                </S_HomeTitle>
                <S_HomeMenuWrapper>
                    <S_HomeMenu onClick={handleClickPrompt}>
                        <span>
                            <FileTextOutlined /> Prompt
                        </span>
                        <RightOutlined />
                    </S_HomeMenu>
                    <S_HomeMenu onClick={handleClickEvaluation}>
                        <span>
                            <LikeOutlined /> Evaluation{' '}
                        </span>
                        <RightOutlined />
                    </S_HomeMenu>
                    <S_HomeMenu onClick={handleClickData}>
                        <span>
                            <DatabaseOutlined /> Data
                        </span>
                        <RightOutlined />
                    </S_HomeMenu>
                </S_HomeMenuWrapper>
            </S_HomeContent>
        </S_HomeWrapper>
    )
}

export default Home
