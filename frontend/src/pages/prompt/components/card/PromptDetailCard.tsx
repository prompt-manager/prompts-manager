import { Card, TextArea, Switch, Checkbox } from "../../../../components";
import { S_FlexWrapper } from '../../../styles/Page.style'

export interface PromptDetailCardProps {
    version: string
    systemPrompt: string
    userPrompt: string
    assistantPrompt: string
    isActive: boolean
    isDelete: boolean
}

const Label = ({ title }: {title: string}) => (
    <p>{title}</p>
)

const PromptContent = ({ title, textValue } : {
    title: string,
    textValue: string
}) => (
    <S_FlexWrapper
        flexDirection="column"
        gap={8}
    >
        <Label title={title} />
        <TextArea
            value={textValue}
            disabled={true}
            height={100}
        />
    </S_FlexWrapper>
)


const PromptDetailCard = ({version, systemPrompt, userPrompt, assistantPrompt, isActive, isDelete}: PromptDetailCardProps) => {
    return (
            <Card
                title={version}
                width="350px"
            >
                <S_FlexWrapper
                    flexDirection="column"
                    gap={16}
                >
                    <PromptContent
                        title="System prompt"
                        textValue={systemPrompt}
                    />
                    <PromptContent
                        title="User prompt"
                        textValue={userPrompt}
                    />
                    <PromptContent
                        title="Assistant prompt"
                        textValue={assistantPrompt}
                    />
                    <S_FlexWrapper
                        gap={64}
                    >
                        <S_FlexWrapper
                            gap={8}
                        >
                            <Label title="Active"/>
                            <Switch />
                        </S_FlexWrapper>
                        <S_FlexWrapper
                            gap={8}
                        >
                            <Label title="Delete"/>
                            <Checkbox />
                        </S_FlexWrapper>
                    </S_FlexWrapper>
                </S_FlexWrapper>
            </Card>
    )
}

export default PromptDetailCard;
