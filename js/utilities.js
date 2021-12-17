(function () {

    adjustHeight()

    window.addEventListener('resize', adjustHeight)

    function adjustHeight() {
        const elements = ['header', 'footer', '#controls']
        let height = 0
        elements.forEach(element => {
            if (document.querySelector(element)) {
                let size = document.querySelector(element)
                height += size.offsetHeight;
            }
        });

            let size = window.innerHeight - height
            let content = document.querySelector('#content')
            let mapSize = document.querySelector("#map")

            if (window.innerWidth >= 768) {
                content.style.height = `${size}px`
                mapSize.style.height = `${size}px`
            } else {
                content.style.height = `${size/2}px`
                mapSize.style.height = `${size/2}px`
            }
        }
})();