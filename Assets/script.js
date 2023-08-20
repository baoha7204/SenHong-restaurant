const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const header = $('header');

/**
 * Insert header
 */

/**
 * Style header moving
 */
const headerContainer = $('.header__container');

const headerHeight = header.offsetHeight;

const firstSection = $('section');
const sectionOffsetTop = firstSection.offsetTop;
document.onscroll = () => {
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

/**
 * Prevent from scrolling when open header menu in sidebar
 */

const checkBoxNavbar = $('#checkbox_toggle');
checkBoxNavbar.onclick = () => {
    if(checkBoxNavbar.checked){
        document.body.classList.add('disable-scrolling');
    } else{
        document.body.classList.remove('disable-scrolling');
    }
}

/**
 * Style side-navigation__item underline
 */
const sideNavigation = $('.side-navigation');

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

/**
 * Style side-navigation__item centering
 */

const resize_ob = new ResizeObserver(function(entries) {
	// since we are observing only a single element, so we access the first element in entries array
	let rect = entries[0].contentRect;

	// calculate new margin width
	let newMargin = rect.width / 2 - 25;

    // style the item based on its parent
    sideNavigation.style.setProperty('--center-margin', `${newMargin}px`);
});

// start observing for resize
resize_ob.observe(sideNavigation);

/**
 * Add option for select tags
 */
const tagsAPI = 'http://localhost:3000/options';
const selectTags = $('#tags');
fetch(tagsAPI)
    .then((response) => response.json())
    .then((tags) => {
        const tagsHTML = tags.map((tag) => {
            return `<option value='${tag['option-value']}'>${tag['option-name']}</option>`
        });
        selectTags.innerHTML = tagsHTML.join('\n');
    });


function MultiSelectTag (el, customs = {shadow: false, rounded:true}) {
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
            }
        });

    }

    function createElements() {
        // Create custom elements
        options = getOptions();
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

        const icon = domParser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 21 6 15"></polyline></svg>`, 'image/svg+xml').documentElement
        button.append(icon)


        body.append(btnContainer)
        wrapper.append(body)

        drawer = document.createElement('div');
        drawer.classList.add(...['drawer', 'hidden'])
        if(customs.shadow) {
            drawer.classList.add('shadow')
        }
        if(customs.rounded) {
            drawer.classList.add('rounded')
        }
        drawer.append(inputBody)
        ul = document.createElement('ul');
        
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
                if(val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
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
        const itemClose = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
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
    function setValues(fireEvent=true) {
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
// selectTags.options
console.log(Array.from(selectTags.options));

MultiSelectTag('tags', {
    rounded: true,    // default true
    shadow: true,      // default false
    placeholder: 'Tìm kiếm',  // default Search...
    onChange: function(values) {
        console.log(values)
    }
});
