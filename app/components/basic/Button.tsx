export function PrimaryButton({children, onClick}: {children: React.ReactNode, onClick?: () => void}){
    return (
        <div>
            <button onClick={onClick}>{children}</button>
        </div>
    )
}

export function SuccessButton({children, onClick}: {children: React.ReactNode, onClick?: () => void}){
    return (
        <div>
            <button onClick={onClick}>{children}</button>
        </div>
    )
}