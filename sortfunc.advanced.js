export default (th_element) => {
    return (obj, index) => {
        obj = obj.cells[index]
        return obj.getAttribute('data-sort') || obj.innerText
    }
}