// Please note that these are EXAMPLES of comparisons, not a finished function
export default (th_element) => {

    // Sort data sizes, such as GB, MB, kB, etc:
    if (/\bsize\b/.test(th_element.className)) {
        return (obj, index) => {
            var matches = obj.cells[index].innerText.match(/(\d+)([kMGT])B/)
            var vals = {
                k: 1,
                M: 2,
                G: 3,
                T: 4,
            };
            return matches[1] * Math.pow(1000, vals[matches[2]])
        }
    }

    // if you want to sort weird date formats, this is one possible solution:
    if (/\bdate\b/.test(th_element.className)) {
        return (obj, index) => {
            return obj.cells[index].innerText.replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2')
        }
    }

    // default, same as advanced
    return (obj, index) => {
        obj = obj.cells[index]
        return obj.getAttribute('data-sort') || obj.innerText
    }
}