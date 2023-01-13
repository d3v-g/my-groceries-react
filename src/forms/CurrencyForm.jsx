export default function CurrencyForm({ currency, submitResponse }) {
    return (
        <div>
            <form className='items--currency'>
                <label htmlFor='currency'>Choose your currency:</label>
                <select value={currency ?? '$'} onChange={e => submitResponse(e.target.value)}>
                    <option value='$'>$</option>
                    <option value='£'>£</option>
                    <option value='€'>€</option>
                    <option value='¥'>¥</option>
                </select>
            </form>
        </div>
    )
}