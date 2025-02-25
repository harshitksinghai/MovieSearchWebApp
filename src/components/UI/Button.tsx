import './Button.css'


const Button = (props: {buttonText: string}) => {
  return (
    <div className='button-container'>
      <button className='button'>{props.buttonText}</button>
    </div>
  )
}

export default Button
