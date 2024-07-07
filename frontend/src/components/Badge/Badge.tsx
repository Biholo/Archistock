const Badge = ({ children, color, css }: any) => {
    return (
        <div className={`badge badge-${color} ${css}`}>{children}</div>
    )
}

export default Badge;