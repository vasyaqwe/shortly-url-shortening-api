const nav = document.querySelector('.primary-nav');
const navToggle = document.querySelector('.nav-toggle');
const input = document.getElementById('url');
const form = document.querySelector('form');
const msg = document.querySelector('.msg');
const shortenLinks = document.querySelector('.shorten-links');

const linksArr = [];
const links = localStorage.getItem('linksArr');

if (links) {
    const resultArr = JSON.parse(links);
    linksArr.push(...resultArr)

    for (let i = 0; i < resultArr.length; i++) {
        const shortenLinksContainer = document.createElement('div');
        shortenLinksContainer.classList.add('shorten-links__container');
        shortenLinks.append(shortenLinksContainer);
        shortenLinksContainer.innerHTML = resultArr[i].html;
    }

}

input.addEventListener('input', checkInput);
form.addEventListener('submit', (e) => {
    if (isURL(input.value) === false) {
        e.preventDefault();
        msg.firstChild.innerText = 'Please add a link';
        input.style.outlineColor = 'hsl(0, 87%, 67%)';
    } else {
        e.preventDefault();
        shortenLink();
    }
})

function checkInput() {
    if (isURL(input.value) === false) {
        msg.firstChild.innerText = 'Please add a link';
        input.style.outlineColor = 'hsl(0, 87%, 67%)';
    } else {
        msg.firstChild.innerText = '';
        input.style.outlineColor = 'hsl(180, 66%, 49%)';
    }
}
function isURL(inputValue) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(inputValue);
}

const shortenLink = async () => {
    const res = await axios.get(`https://api.shrtco.de/v2/shorten?url=${input.value}`);
    const resultLink = res.data.result.full_short_link;
    const shortenLinksContainer = document.createElement('div');
    shortenLinks.append(shortenLinksContainer);
    shortenLinksContainer.classList.add('shorten-links__container');
    shortenLinksContainer.innerHTML = `
                        <a href="${resultLink}" target="_blank" class="shorten-links__link initial-link">${input.value}</a>
                        <div class="shorten-links__container__inner">
                            <a class="shorten-links__link--shortened shortened-link" target="_blank" href="${resultLink}">${resultLink}</a>
                            <button class="btn btn--copy shorten-links__btn">Copy</button>
                        </div>
`;

    linksArr.push({ html: shortenLinksContainer.innerHTML });

    localStorage.setItem('linksArr', JSON.stringify(linksArr));
    const copyBtns = document.querySelectorAll('.btn--copy');
    const shortenedLinks = document.querySelectorAll('.shortened-link');

    //copy links//
    for (let i = 0; i < copyBtns.length; i++) {
        copyBtns[i].addEventListener('click', () => {
            navigator.clipboard.writeText(shortenedLinks[i]);
            copyBtns[i].classList.remove('btn--copy');
            copyBtns[i].innerText = 'Copied!';
            copyBtns[i].classList.add('btn--copied');
        });
    };
    //copy links//
}

//copy links//
const copyBtns = document.querySelectorAll('.btn--copy');
const shortenedLinks = document.querySelectorAll('.shortened-link');
copyLinks();
//copy links//



function copyLinks() {
    for (let i = 0; i < copyBtns.length; i++) {
        copyBtns[i].addEventListener('click', () => {
            navigator.clipboard.writeText(shortenedLinks[i]);
            copyBtns[i].classList.remove('btn--copy');
            copyBtns[i].innerText = 'Copied!';
            copyBtns[i].classList.add('btn--copied');
        });
    };
}


navToggle.addEventListener('click', () => {
    const attribute = nav.getAttribute('data-visible');
    if (attribute === 'false') {
        nav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
        navToggle.firstChild.classList.remove('fa-bars');
        navToggle.firstChild.classList.add('fa-xmark');
    } else {
        nav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
        navToggle.firstChild.classList.remove('fa-xmark');
        navToggle.firstChild.classList.add('fa-bars');
    }
})
