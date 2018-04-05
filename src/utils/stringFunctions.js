export function camelize(str) {
	return str.toString().split(' ').map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join('')
}
