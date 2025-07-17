import React from 'react'
import { Button } from '../../components'

import {
    S_FlexWrapper,
    S_PromptMainDescription,
    S_PromptMainTitle,
} from '../styles/Page.style'
import { useNavigate } from 'react-router-dom'

const PromptMain = () => {
    const navigate = useNavigate()

    const handleClickCreate = () => {
        navigate('/prompt/create')
    }

    const handleClickManage = () => {
        navigate('/prompt/manage')
    }

    return (
        <S_FlexWrapper
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100vh"
            gap={16}
        >
            <S_PromptMainTitle>
                Get Started with Prompt Management
            </S_PromptMainTitle>
            <S_PromptMainDescription>
                Prompt Manager helps you centrally manage, version control, and
                collaboratively iterate on your prompts.
                <br />
                Start using prompt management to improve your LLM application's
                performance and maintainability.
            </S_PromptMainDescription>
            <S_FlexWrapper gap={16} margin={'24px 0 0 0'}>
                <Button type="primary" onClick={handleClickCreate}>
                    Create Prompt
                </Button>
                <Button type="primary" onClick={handleClickManage}>
                    Manage Prompt
                </Button>
            </S_FlexWrapper>
        </S_FlexWrapper>
    )
}

export default PromptMain
