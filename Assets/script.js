const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const header = $('header');
const footer = $('footer');
const sideNavigation = $('.side-navigation');
/**
 * Insert header
 */
function insertHeader() {
    header.innerHTML = `<div class="header__container">
    <!-- Logo -->
    <div class="logo"></div>
    <!-- Navigation bar -->
    <div class="header__navbar">
        <label for="checkbox_toggle" class="navbar__hamburger">
            <input type="checkbox" id="checkbox_toggle">
        </label>
        <nav class="navbar__list">
            <li class="list__item">
                <a href="#" class="item--introduction" title="Giới thiệu">Giới thiệu</a>
            </li>
            <li class="list__item mobile-list__item--active">
                <a href="#" class="item--menu" title="Giới thiệu">Thực đơn</a>
            </li>
            <li class="list__item">
                <a href="#" class="item--booking" title="Giới thiệu">Đặt bàn</a>
            </li>
            <li class="list__item">
                <a href="#" class="item--store-locator" title="Hệ thống cửa hàng">Hệ thống</a>
            </li>
        </nav>
    </div>
</div>`;
}
/**
 * Insert footer
 */
function insertFooter() {
    footer.innerHTML = `<div class="footer__container">
    <div class="footer__upper">
        <div class="logo"></div>
        <div class="footer__card upper__item">
            <div class="upper-item__title">
                <h4>trụ sở chính</h4>
                <h4 data-title="nhà hàng miền tây sen hồng">nhà hàng miền tây sen hồng</h4>
            </div>
            <div class="upper-item__body">
                <li class="body__text"><p><strong>MST:</strong> 0762953411</p></li>
                <li class="body__text"><p><strong>Địa chỉ:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non quos sit voluptatibus recusandae. Ut voluptatem maxime eum. Asperiores quaerat fugit aut nemo quas ad, odio error qui quis accusamus!</p></li>
                <li class="body__text"><p><strong>Hotline:</strong><a href="tel: +1-555-555-5555"> 1-555-555-5555</a></p></li>
            </div>
        </div>
        <div class="footer__social-media upper__item">
            <div class="upper-item__title">
                <h4>mạng xã hội</h4>
            </div>
            <div class="upper-item__body">
                <button type="button" class="button" id="facebook"><a href="https://www.facebook.com/bao.haminhquoc/" title="Facebook Sen Hồng" target="_blank"><i class="fa-brands fa-facebook-f"></i></a></button>
                <button type="button" class="button" id="facebook"><a href="https://www.instagram.com/bao_ha_real/" title="Instagram Sen Hồng" target="_blank"><i class="fa-brands fa-instagram"></i></a></button>
            </div>
        </div>
    </div>
    <div class="footer__bottom">Sen Hồng &copy; 2023</div>
    <div class="footer__scrollUp">
        <button type="button" class="button" id="up"><a href='#'><i class="fa-solid fa-arrow-up"></i></a></button>
    </div>
</div>`;
}

/**
 * Style header moving
 */
function styleHeaderMoving() {
    const headerContainer = $('.header__container');
    const firstSection = $('section');
    const headerHeight = header.offsetHeight;
    document.onscroll = () => {
        const sectionOffsetTop = firstSection.offsetTop;
        if(window.matchMedia("(min-width: 769px)").matches){
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var dist = sectionOffsetTop - (scrollTop + headerHeight);
            if(dist < 0){
                headerContainer.classList.add('header__container--moving');
            } else{
                headerContainer.classList.remove('header__container--moving');
            }
        }
    }
}

/**
 * Prevent from scrolling when open header menu in sidebar
 */
function preventScrollingSidebar() {
    const checkBoxNavbar = $('#checkbox_toggle');
    checkBoxNavbar.onclick = () => {
        if(checkBoxNavbar.checked){
            document.body.classList.add('disable-scrolling');
        } else{
            document.body.classList.remove('disable-scrolling');
        }
    }
}

/**
 * Style side-navigation__item underline
 */
function sideNavigationUnderline() {
    sideNavigation.onmouseover = (e) => {
        const item = e.target.closest('.side-navigation__item');
        if(item){
            const labelNode = item.children[1];
            const width = labelNode.offsetWidth;
            labelNode.style.setProperty('--uderline-width', `${width}px`);
        }
    }

    sideNavigation.onmouseout = (e) => {
        const item = e.target.closest('.side-navigation__item');
        if(item){
            const labelNode = item.children[1];
            labelNode.style.setProperty('--uderline-width', '0');
        }
    }
}

/**
 * Style side-navigation__item centering
 */
function centerSideNavigation() {
    const resize_ob = new ResizeObserver(function(entries) {
        // since we are observing only a single element, so we access the first element in entries array
        let rect = entries[0].contentRect;
    
        // calculate new margin width
        let newMargin = rect.width / 4 - 30;
    
        // style the item based on its parent
        sideNavigation.style.setProperty('--center-margin', `${newMargin}px`);
    });
    
    // start observing for resize
    resize_ob.observe(sideNavigation);
}

/**
 * Add option for select tags
 */
const tagsAPI = 'http://localhost:3000/options';
const selectTags = $('#tags');
const listTags = $('.side-navigation__list');
async function getApi() {
    const response = await fetch(tagsAPI);
    const tags = await response.json();
    const tagsHTML = tags.map((tag) => {
      return `<option value='${tag["option-value"]}'>${tag["option-name"]}</option>`;
    });
    const listTagsHTML = tags.map((tag) => {
        return `<li class="side-navigation__item">
                    <input type="checkbox" id="navigation-item-${tag["option-value"]}" value='${tag["option-value"]}'><label for="navigation-item-${tag["option-value"]}">${tag["option-name"]}</label>
                </li>`;
    });

    // side-navigation__list
    listTags.innerHTML = listTagsHTML.join("\n") 
    + `<button type="submit" class="button search-button"><a href="#"><i class="fa fa-search"></i></a></button>`;

    // select tags
    selectTags.innerHTML = tagsHTML.join("\n");
    MultiSelectTag('tags', {
        rounded: true,    // default true
        shadow: true,      // default false
        placeholder: 'Tìm kiếm',  // default Search...
        onChange: function(values) {
            console.log(values);
        }
    });
}

function MultiSelectTag (el, customs = {shadow: false, rounded: true}) {
    var element = null
    var options = null
    var customSelectContainer = null
    var wrapper = null
    var btnContainer = null
    var body = null
    var inputContainer = null
    var inputBody = null
    var input = null
    var button = null
    var drawer = null
    var ul = null
    var domParser = new DOMParser()
    init()

    function init() {
        element = document.getElementById(el)
        createElements()
        initOptions()
        enableItemSelection()
        setValues(false)

        button.addEventListener('click', () => {
            if(drawer.classList.contains('hidden')) {
                initOptions()
                enableItemSelection()
                button.classList.add('clicked')
                drawer.classList.remove('hidden')
                input.focus()
            }
        })

        input.addEventListener('keyup', (e) => {
                initOptions(e.target.value)
                enableItemSelection()
        })

        input.addEventListener('keydown', (e) => {
            if(e.key === 'Backspace' && !e.target.value && inputContainer.childElementCount > 1) {
                const child = body.children[inputContainer.childElementCount - 2].firstChild
                const option = options.find((op) => op.value == child.dataset.value)
                option.selected = false
                removeTag(child.dataset.value)
                setValues()
            }
            
        })
        
        window.addEventListener('click', (e) => {   
            if (!customSelectContainer.contains(e.target)){
                drawer.classList.add('hidden')
                button.classList.remove('clicked');
            }
        });

    }

    function createElements() {
        // Create custom elements
        options = getOptions()
        element.classList.add('hidden')
        
        // .multi-select-tag
        customSelectContainer = document.createElement('div')
        customSelectContainer.classList.add('mult-select-tag')

        // .container
        wrapper = document.createElement('div')
        wrapper.classList.add('wrapper')

        // body
        body = document.createElement('div')
        body.classList.add('body')
        if(customs.shadow) {
            body.classList.add('shadow')
        }
        if(customs.rounded) {
            body.classList.add('rounded')
        }
        
        // .input-container
        inputContainer = document.createElement('div')
        inputContainer.classList.add('input-container')

        // input
        input = document.createElement('input')
        input.classList.add('input')
        input.placeholder = `${customs.placeholder || 'Search...'}`

        inputBody = document.createElement('inputBody')
        inputBody.classList.add('input-body')
        inputBody.append(input)

        body.append(inputContainer)

        // .btn-container
        btnContainer = document.createElement('div')
        btnContainer.classList.add('btn-container')

        // button
        button = document.createElement('button')
        button.type = 'button'
        btnContainer.append(button)

        const icon = domParser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 21 6 15"></polyline></svg>`, 'image/svg+xml').documentElement
        button.append(icon)


        body.append(btnContainer)
        wrapper.append(body)

        drawer = document.createElement('div')
        drawer.classList.add(...['drawer', 'hidden'])
        if(customs.shadow) {
            drawer.classList.add('shadow')
        }
        if(customs.rounded) {
            drawer.classList.add('rounded')
        }
        drawer.append(inputBody)
        ul = document.createElement('ul')
        
        drawer.appendChild(ul)
    
        customSelectContainer.appendChild(wrapper)
        customSelectContainer.appendChild(drawer)

        // Place TailwindTagSelection after the element
        if (element.nextSibling) {
            element.parentNode.insertBefore(customSelectContainer, element.nextSibling)
        }
        else {
            element.parentNode.appendChild(customSelectContainer);
        }
    }

    function initOptions(val = null) {
        ul.innerHTML = ''
        for (var option of options) {
            if (option.selected) {
                !isTagSelected(option.value) && createTag(option)
            }
            else {
                const li = document.createElement('li')
                li.innerHTML = option.label
                li.dataset.value = option.value
                
                // For search
                if(val && (option.label.toLowerCase().startsWith(val.toLowerCase()) || option.value.toLowerCase().startsWith(val.toLowerCase()))) {
                    ul.appendChild(li)
                }
                else if(!val) {
                    ul.appendChild(li)
                }
            }
        }
    }

    function createTag(option) {
        // Create and show selected item as tag
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-container');
        const itemLabel = document.createElement('div');
        itemLabel.classList.add('item-label');
        itemLabel.innerHTML = option.label
        itemLabel.dataset.value = option.value 
        const itemClose = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`, 'image/svg+xml').documentElement
 
        itemClose.addEventListener('click', () => {
            const unselectOption = options.find((op) => op.value == option.value)
            unselectOption.selected = false
            removeTag(option.value)
            initOptions()
            setValues()
        })
    
        itemDiv.appendChild(itemLabel)
        itemDiv.appendChild(itemClose)
        inputContainer.append(itemDiv)
    }

    function enableItemSelection() {
        // Add click listener to the list items
        for(var li of ul.children) {
            li.addEventListener('click', (e) => {
                options.find((o) => o.value == e.target.dataset.value).selected = true
                input.value = null
                initOptions()
                setValues()
                input.focus()
            })
        }
    }

    function isTagSelected(val) {
        // If the item is already selected
        for(var child of inputContainer.children) {
            if(!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                return true
            }
        }
        return false
    }
    function removeTag(val) {
        // Remove selected item
        for(var child of inputContainer.children) {
            if(!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                inputContainer.removeChild(child)
            }
        }
    }
    function setValues(fireEvent = true) {
        // Update element final values
        selected_values = []
        for(var i = 0; i < options.length; i++) {
            element.options[i].selected = options[i].selected
            if(options[i].selected) {
                selected_values.push({label: options[i].label, value: options[i].value})
            }
        }
        if (fireEvent && customs.hasOwnProperty('onChange')) {
            customs.onChange(selected_values)
        }
    }
    function getOptions() {
        // Map element options
        return [...element.options].map((op) => {
            return {
                value: op.value,
                label: op.label,
                selected: op.selected,
            }
        })
    }
}

function myWebApp() {
    // header
    insertHeader();
    styleHeaderMoving();
    preventScrollingSidebar();

    // side navigation
    sideNavigationUnderline();
    centerSideNavigation();

    // footer
    insertFooter();

    // Get options for food navigation
    getApi();
}

myWebApp();
