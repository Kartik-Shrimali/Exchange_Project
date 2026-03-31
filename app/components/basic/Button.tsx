export function PrimaryButton({children}:{children : React.ReactNode}){
    return (
        <div>
            <button>{children}</button>
        </div>
    )
}

export function SuccessButton({children} : {children:React.ReactNode}){
    return (
        <div>
            <button>{children}</button>
        </div>
    )
}