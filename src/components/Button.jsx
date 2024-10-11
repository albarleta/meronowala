function Button({ onClick, children }) {
  return (
    <button className="bg-gray-500 text-white px-4 py-2" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
