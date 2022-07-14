export default function Logo(props) {
    return (
        <div>
            <img
                className="logo"
                src="/logo.png"
                alt="logo"
                onClick={() => props.closeModal()}
            />
        </div>
    );
}
