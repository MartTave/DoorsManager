var Aventus;
(Aventus||(Aventus = {}));
(function (Aventus) {
const moduleName = `Aventus`;
const _ = {};


let _n;
const ElementExtension=class ElementExtension {
    /**
     * Find a parent by tagname if exist Static.findParentByTag(this, "av-img")
     */
    static findParentByTag(element, tagname, untilNode) {
        let el = element;
        if (Array.isArray(tagname)) {
            for (let i = 0; i < tagname.length; i++) {
                tagname[i] = tagname[i].toLowerCase();
            }
        }
        else {
            tagname = [tagname.toLowerCase()];
        }
        let checkFunc = (el) => {
            return tagname.indexOf((el.nodeName || el.tagName).toLowerCase()) != -1;
        };
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            if (checkFunc(el)) {
                return el;
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return null;
    }
    /**
     * Find a parent by class name if exist Static.findParentByClass(this, "my-class-img") = querySelector('.my-class-img')
     */
    static findParentByClass(element, classname, untilNode) {
        let el = element;
        if (!Array.isArray(classname)) {
            classname = [classname];
        }
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            for (let classnameTemp of classname) {
                if (el['classList'] && el['classList'].contains(classnameTemp)) {
                    return el;
                }
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return null;
    }
    /**
     * Find a parent by type if exist Static.findParentyType(this, Aventus.Img)
     */
    static findParentByType(element, type, untilNode) {
        let el = element;
        let checkFunc = (el) => {
            return false;
        };
        if (typeof type == "function" && type['prototype']['constructor']) {
            checkFunc = (el) => {
                if (el instanceof type) {
                    return true;
                }
                return false;
            };
        }
        else {
            console.error("you must provide a class inside this function");
            return null;
        }
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            if (checkFunc(el)) {
                return el;
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return null;
    }
    /**
     * Find list of parents by tagname
     */
    static findParents(element, tagname, untilNode) {
        let el = element;
        if (Array.isArray(tagname)) {
            for (let i = 0; i < tagname.length; i++) {
                tagname[i] = tagname[i].toLowerCase();
            }
        }
        else {
            tagname = [tagname.toLowerCase()];
        }
        let result = [];
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            if (tagname.indexOf((el.nodeName || el['tagName']).toLowerCase()) != -1) {
                result.push(el);
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return result;
    }
    /**
     * Check if element contains a child
     */
    static containsChild(element, child) {
        var rootScope = element.getRootNode();
        var elScope = child.getRootNode();
        while (elScope != rootScope) {
            if (!elScope['host']) {
                return false;
            }
            child = elScope['host'];
            elScope = elScope['host'].getRootNode();
        }
        return element.contains(child);
    }
    /**
     * Get element inside slot
     */
    static getElementsInSlot(element, slotName) {
        if (element.shadowRoot) {
            let slotEl;
            if (slotName) {
                slotEl = element.shadowRoot.querySelector('slot[name="' + slotName + '"]');
            }
            else {
                slotEl = element.shadowRoot.querySelector("slot");
            }
            while (true) {
                if (!slotEl) {
                    return [];
                }
                var listChild = Array.from(slotEl.assignedElements());
                if (!listChild) {
                    return [];
                }
                let slotFound = false;
                for (let i = 0; i < listChild.length; i++) {
                    if (listChild[i].nodeName == "SLOT") {
                        slotEl = listChild[i];
                        slotFound = true;
                        break;
                    }
                }
                if (!slotFound) {
                    return listChild;
                }
            }
        }
        return [];
    }
    /**
     * Get deeper element inside dom at the position X and Y
     */
    static getElementAtPosition(x, y, startFrom) {
        var _realTarget = (el, i = 0) => {
            if (i == 50) {
                debugger;
            }
            if (el.shadowRoot && x !== undefined && y !== undefined) {
                var newEl = el.shadowRoot.elementFromPoint(x, y);
                if (newEl && newEl != el && el.shadowRoot.contains(newEl)) {
                    return _realTarget(newEl, i + 1);
                }
            }
            return el;
        };
        if (startFrom == null) {
            startFrom = document.body;
        }
        return _realTarget(startFrom);
    }
}
ElementExtension.Namespace=`${moduleName}`;
_.ElementExtension=ElementExtension;
const Instance=class Instance {
    static elements = new Map();
    static get(type) {
        let result = this.elements.get(type);
        if (!result) {
            let cst = type.prototype['constructor'];
            result = new cst();
            this.elements.set(type, result);
        }
        return result;
    }
    static set(el) {
        let cst = el.constructor;
        if (this.elements.get(cst)) {
            return false;
        }
        this.elements.set(cst, el);
        return true;
    }
    static destroy(el) {
        let cst = el.constructor;
        return this.elements.delete(cst);
    }
}
Instance.Namespace=`${moduleName}`;
_.Instance=Instance;
const Style=class Style {
    static instance;
    static noAnimation;
    static defaultStyleSheets = {
        "@general": `:host{display:inline-block;box-sizing:border-box}:host *{box-sizing:border-box}`,
    };
    static store(name, content) {
        this.getInstance().store(name, content);
    }
    static get(name) {
        return this.getInstance().get(name);
    }
    static load(name, url) {
        return this.getInstance().load(name, url);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Style();
        }
        return this.instance;
    }
    constructor() {
        for (let name in Style.defaultStyleSheets) {
            this.store(name, Style.defaultStyleSheets[name]);
        }
        Style.noAnimation = new CSSStyleSheet();
        Style.noAnimation.replaceSync(`:host{-webkit-transition: none !important;-moz-transition: none !important;-ms-transition: none !important;-o-transition: none !important;transition: none !important;}:host *{-webkit-transition: none !important;-moz-transition: none !important;-ms-transition: none !important;-o-transition: none !important;transition: none !important;}`);
    }
    stylesheets = new Map();
    async load(name, url) {
        try {
            let style = this.stylesheets.get(name);
            if (!style || style.cssRules.length == 0) {
                let txt = await (await fetch(url)).text();
                this.store(name, txt);
            }
        }
        catch (e) {
        }
    }
    store(name, content) {
        let style = this.stylesheets.get(name);
        if (!style) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(content);
            this.stylesheets.set(name, sheet);
            return sheet;
        }
        else {
            style.replaceSync(content);
            return style;
        }
    }
    get(name) {
        let style = this.stylesheets.get(name);
        if (!style) {
            style = this.store(name, "");
        }
        return style;
    }
}
Style.Namespace=`${moduleName}`;
_.Style=Style;
const compareObject=function compareObject(obj1, obj2) {
    if (Array.isArray(obj1)) {
        if (!Array.isArray(obj2)) {
            return false;
        }
        obj2 = obj2.slice();
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            let foundElement = false;
            for (let j = 0; j < obj2.length; j++) {
                if (compareObject(obj1[i], obj2[j])) {
                    obj2.splice(j, 1);
                    foundElement = true;
                    break;
                }
            }
            if (!foundElement) {
                return false;
            }
        }
        return true;
    }
    else if (obj1 instanceof Date) {
        return obj1.toString() === obj2.toString();
    }
    else if (obj1 !== null && typeof obj1 == 'object') {
        if (obj2 === null || typeof obj1 !== 'object') {
            return false;
        }
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        for (let key in obj1) {
            if (!(key in obj2)) {
                return false;
            }
            if (!compareObject(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }
    else {
        return obj1 === obj2;
    }
}

_.compareObject=compareObject;
const Callback=class Callback {
    callbacks = [];
    /**
     * Clear all callbacks
     */
    clear() {
        this.callbacks = [];
    }
    /**
     * Add a callback
     */
    add(cb) {
        this.callbacks.push(cb);
    }
    /**
     * Remove a callback
     */
    remove(cb) {
        let index = this.callbacks.indexOf(cb);
        if (index != -1) {
            this.callbacks.splice(index, 1);
        }
    }
    /**
     * Trigger all callbacks
     */
    trigger(args) {
        let result = [];
        let cbs = [...this.callbacks];
        for (let cb of cbs) {
            result.push(cb.apply(null, args));
        }
        return result;
    }
}
Callback.Namespace=`${moduleName}`;
_.Callback=Callback;
const Mutex=class Mutex {
    waitingList = [];
    isLocked = false;
    /**
     * Wait the mutex to be free then get it
     */
    waitOne() {
        return new Promise((resolve) => {
            if (this.isLocked) {
                this.waitingList.push((run) => {
                    resolve(run);
                });
            }
            else {
                this.isLocked = true;
                resolve(true);
            }
        });
    }
    /**
     * Release the mutex
     */
    release() {
        let nextFct = this.waitingList.shift();
        if (nextFct) {
            nextFct(true);
        }
        else {
            this.isLocked = false;
        }
    }
    /**
     * Release the mutex
     */
    releaseOnlyLast() {
        if (this.waitingList.length > 0) {
            let lastFct = this.waitingList.pop();
            for (let fct of this.waitingList) {
                fct(false);
            }
            this.waitingList = [];
            if (lastFct) {
                lastFct(true);
            }
        }
        else {
            this.isLocked = false;
        }
    }
    /**
     * Clear mutex
     */
    dispose() {
        this.waitingList = [];
        this.isLocked = false;
    }
    async safeRun(cb) {
        let result = null;
        await this.waitOne();
        try {
            result = cb.apply(null, []);
        }
        catch (e) {
        }
        await this.release();
        return result;
    }
    async safeRunAsync(cb) {
        let result = null;
        await this.waitOne();
        try {
            result = await cb.apply(null, []);
        }
        catch (e) {
        }
        await this.release();
        return result;
    }
    async safeRunLast(cb) {
        let result = null;
        if (await this.waitOne()) {
            try {
                result = cb.apply(null, []);
            }
            catch (e) {
            }
            await this.releaseOnlyLast();
        }
        return result;
    }
    async safeRunLastAsync(cb) {
        let result;
        if (await this.waitOne()) {
            try {
                result = await cb.apply(null, []);
            }
            catch (e) {
            }
            await this.releaseOnlyLast();
        }
        return result;
    }
}
Mutex.Namespace=`${moduleName}`;
_.Mutex=Mutex;
var WatchAction;
(function (WatchAction) {
    WatchAction[WatchAction["CREATED"] = 0] = "CREATED";
    WatchAction[WatchAction["UPDATED"] = 1] = "UPDATED";
    WatchAction[WatchAction["DELETED"] = 2] = "DELETED";
})(WatchAction || (WatchAction = {}));

_.WatchAction=WatchAction;
const PressManager=class PressManager {
    static create(options) {
        if (Array.isArray(options.element)) {
            let result = [];
            for (let el of options.element) {
                let cloneOpt = { ...options };
                cloneOpt.element = el;
                result.push(new PressManager(cloneOpt));
            }
            return result;
        }
        else {
            return new PressManager(options);
        }
    }
    options;
    element;
    delayDblPress = 150;
    delayLongPress = 700;
    nbPress = 0;
    offsetDrag = 20;
    state = {
        oneActionTriggered: false,
        isMoving: false,
    };
    startPosition = { x: 0, y: 0 };
    customFcts = {};
    timeoutDblPress = 0;
    timeoutLongPress = 0;
    downEventSaved;
    actionsName = {
        press: "press",
        longPress: "longPress",
        dblPress: "dblPress",
        drag: "drag"
    };
    useDblPress = false;
    stopPropagation = () => true;
    functionsBinded = {
        downAction: (e) => { },
        upAction: (e) => { },
        moveAction: (e) => { },
        childPressStart: (e) => { },
        childPressEnd: (e) => { },
        childPress: (e) => { },
        childDblPress: (e) => { },
        childLongPress: (e) => { },
        childDragStart: (e) => { },
    };
    /**
     * @param {*} options - The options
     * @param {HTMLElement | HTMLElement[]} options.element - The element to manage
     */
    constructor(options) {
        if (options.element === void 0) {
            throw 'You must provide an element';
        }
        this.element = options.element;
        this.checkDragConstraint(options);
        this.assignValueOption(options);
        this.options = options;
        this.init();
    }
    /**
     * Get the current element focused by the PressManager
     */
    getElement() {
        return this.element;
    }
    checkDragConstraint(options) {
        if (options.onDrag !== void 0) {
            if (options.onDragStart === void 0) {
                options.onDragStart = (e) => { };
            }
            if (options.onDragEnd === void 0) {
                options.onDragEnd = (e) => { };
            }
        }
        if (options.onDragStart !== void 0) {
            if (options.onDrag === void 0) {
                options.onDrag = (e) => { };
            }
            if (options.onDragEnd === void 0) {
                options.onDragEnd = (e) => { };
            }
        }
        if (options.onDragEnd !== void 0) {
            if (options.onDragStart === void 0) {
                options.onDragStart = (e) => { };
            }
            if (options.onDrag === void 0) {
                options.onDrag = (e) => { };
            }
        }
    }
    assignValueOption(options) {
        if (options.delayDblPress !== undefined) {
            this.delayDblPress = options.delayDblPress;
        }
        if (options.delayLongPress !== undefined) {
            this.delayLongPress = options.delayLongPress;
        }
        if (options.offsetDrag !== undefined) {
            this.offsetDrag = options.offsetDrag;
        }
        if (options.onDblPress !== undefined) {
            this.useDblPress = true;
        }
        if (options.forceDblPress) {
            this.useDblPress = true;
        }
        if (typeof options.stopPropagation == 'function') {
            this.stopPropagation = options.stopPropagation;
        }
        else if (options.stopPropagation === false) {
            this.stopPropagation = () => false;
        }
        if (!options.buttonAllowed)
            options.buttonAllowed = [0];
    }
    bindAllFunction() {
        this.functionsBinded.downAction = this.downAction.bind(this);
        this.functionsBinded.moveAction = this.moveAction.bind(this);
        this.functionsBinded.upAction = this.upAction.bind(this);
        this.functionsBinded.childDblPress = this.childDblPress.bind(this);
        this.functionsBinded.childDragStart = this.childDragStart.bind(this);
        this.functionsBinded.childLongPress = this.childLongPress.bind(this);
        this.functionsBinded.childPress = this.childPress.bind(this);
        this.functionsBinded.childPressStart = this.childPressStart.bind(this);
        this.functionsBinded.childPressEnd = this.childPressEnd.bind(this);
    }
    init() {
        this.bindAllFunction();
        this.element.addEventListener("pointerdown", this.functionsBinded.downAction);
        this.element.addEventListener("trigger_pointer_press", this.functionsBinded.childPress);
        this.element.addEventListener("trigger_pointer_pressstart", this.functionsBinded.childPressStart);
        this.element.addEventListener("trigger_pointer_pressend", this.functionsBinded.childPressEnd);
        this.element.addEventListener("trigger_pointer_dblpress", this.functionsBinded.childDblPress);
        this.element.addEventListener("trigger_pointer_longpress", this.functionsBinded.childLongPress);
        this.element.addEventListener("trigger_pointer_dragstart", this.functionsBinded.childDragStart);
    }
    downAction(e) {
        if (!this.options.buttonAllowed?.includes(e.button)) {
            return;
        }
        this.downEventSaved = e;
        if (this.stopPropagation()) {
            e.stopImmediatePropagation();
        }
        this.customFcts = {};
        if (this.nbPress == 0) {
            this.state.oneActionTriggered = false;
            clearTimeout(this.timeoutDblPress);
        }
        this.startPosition = { x: e.pageX, y: e.pageY };
        document.addEventListener("pointerup", this.functionsBinded.upAction);
        document.addEventListener("pointermove", this.functionsBinded.moveAction);
        this.timeoutLongPress = setTimeout(() => {
            if (!this.state.oneActionTriggered) {
                if (this.options.onLongPress) {
                    this.state.oneActionTriggered = true;
                    this.options.onLongPress(e, this);
                    this.triggerEventToParent(this.actionsName.longPress, e);
                }
                else {
                    this.emitTriggerFunction(this.actionsName.longPress, e);
                }
            }
        }, this.delayLongPress);
        if (this.options.onPressStart) {
            this.options.onPressStart(e, this);
            this.emitTriggerFunctionParent("pressstart", e);
        }
        else {
            this.emitTriggerFunction("pressstart", e);
        }
    }
    upAction(e) {
        if (this.stopPropagation()) {
            e.stopImmediatePropagation();
        }
        document.removeEventListener("pointerup", this.functionsBinded.upAction);
        document.removeEventListener("pointermove", this.functionsBinded.moveAction);
        clearTimeout(this.timeoutLongPress);
        if (this.state.isMoving) {
            this.state.isMoving = false;
            if (this.options.onDragEnd) {
                this.options.onDragEnd(e, this);
            }
            else if (this.customFcts.src && this.customFcts.onDragEnd) {
                this.customFcts.onDragEnd(e, this.customFcts.src);
            }
        }
        else {
            if (this.useDblPress) {
                this.nbPress++;
                if (this.nbPress == 2) {
                    if (!this.state.oneActionTriggered) {
                        this.state.oneActionTriggered = true;
                        this.nbPress = 0;
                        if (this.options.onDblPress) {
                            this.options.onDblPress(e, this);
                            this.triggerEventToParent(this.actionsName.dblPress, e);
                        }
                        else {
                            this.emitTriggerFunction(this.actionsName.dblPress, e);
                        }
                    }
                }
                else if (this.nbPress == 1) {
                    this.timeoutDblPress = setTimeout(() => {
                        this.nbPress = 0;
                        if (!this.state.oneActionTriggered) {
                            if (this.options.onPress) {
                                this.state.oneActionTriggered = true;
                                this.options.onPress(e, this);
                                this.triggerEventToParent(this.actionsName.press, e);
                            }
                            else {
                                this.emitTriggerFunction(this.actionsName.press, e);
                            }
                        }
                    }, this.delayDblPress);
                }
            }
            else {
                if (!this.state.oneActionTriggered) {
                    if (this.options.onPress) {
                        this.state.oneActionTriggered = true;
                        this.options.onPress(e, this);
                        this.triggerEventToParent(this.actionsName.press, e);
                    }
                    else {
                        this.emitTriggerFunction("press", e);
                    }
                }
            }
        }
        if (this.options.onPressEnd) {
            this.options.onPressEnd(e, this);
            this.emitTriggerFunctionParent("pressend", e);
        }
        else {
            this.emitTriggerFunction("pressend", e);
        }
    }
    moveAction(e) {
        if (!this.state.isMoving && !this.state.oneActionTriggered) {
            if (this.stopPropagation()) {
                e.stopImmediatePropagation();
            }
            let xDist = e.pageX - this.startPosition.x;
            let yDist = e.pageY - this.startPosition.y;
            let distance = Math.sqrt(xDist * xDist + yDist * yDist);
            if (distance > this.offsetDrag && this.downEventSaved) {
                this.state.oneActionTriggered = true;
                if (this.options.onDragStart) {
                    this.state.isMoving = true;
                    this.options.onDragStart(this.downEventSaved, this);
                    this.triggerEventToParent(this.actionsName.drag, e);
                }
                else {
                    this.emitTriggerFunction("dragstart", this.downEventSaved);
                }
            }
        }
        else if (this.state.isMoving) {
            if (this.options.onDrag) {
                this.options.onDrag(e, this);
            }
            else if (this.customFcts.src && this.customFcts.onDrag) {
                this.customFcts.onDrag(e, this.customFcts.src);
            }
        }
    }
    triggerEventToParent(eventName, pointerEvent) {
        if (this.element.parentNode) {
            this.element.parentNode.dispatchEvent(new CustomEvent("pressaction_trigger", {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    target: this.element,
                    eventName: eventName,
                    realEvent: pointerEvent
                }
            }));
        }
    }
    childPressStart(e) {
        if (this.options.onPressStart) {
            this.options.onPressStart(e.detail.realEvent, this);
        }
    }
    childPressEnd(e) {
        if (this.options.onPressEnd) {
            this.options.onPressEnd(e.detail.realEvent, this);
        }
    }
    childPress(e) {
        if (this.options.onPress) {
            if (this.stopPropagation()) {
                e.stopImmediatePropagation();
            }
            e.detail.state.oneActionTriggered = true;
            this.options.onPress(e.detail.realEvent, this);
            this.triggerEventToParent(this.actionsName.press, e.detail.realEvent);
        }
    }
    childDblPress(e) {
        if (this.options.onDblPress) {
            if (this.stopPropagation()) {
                e.stopImmediatePropagation();
            }
            if (e.detail.state) {
                e.detail.state.oneActionTriggered = true;
            }
            this.options.onDblPress(e.detail.realEvent, this);
            this.triggerEventToParent(this.actionsName.dblPress, e.detail.realEvent);
        }
    }
    childLongPress(e) {
        if (this.options.onLongPress) {
            if (this.stopPropagation()) {
                e.stopImmediatePropagation();
            }
            e.detail.state.oneActionTriggered = true;
            this.options.onLongPress(e.detail.realEvent, this);
            this.triggerEventToParent(this.actionsName.longPress, e.detail.realEvent);
        }
    }
    childDragStart(e) {
        if (this.options.onDragStart) {
            if (this.stopPropagation()) {
                e.stopImmediatePropagation();
            }
            e.detail.state.isMoving = true;
            e.detail.customFcts.src = this;
            e.detail.customFcts.onDrag = this.options.onDrag;
            e.detail.customFcts.onDragEnd = this.options.onDragEnd;
            e.detail.customFcts.offsetDrag = this.options.offsetDrag;
            this.options.onDragStart(e.detail.realEvent, this);
            this.triggerEventToParent(this.actionsName.drag, e.detail.realEvent);
        }
    }
    emitTriggerFunctionParent(action, e) {
        let el = this.element.parentElement;
        if (el == null) {
            let parentNode = this.element.parentNode;
            if (parentNode instanceof ShadowRoot) {
                this.emitTriggerFunction(action, e, parentNode.host);
            }
        }
        else {
            this.emitTriggerFunction(action, e, el);
        }
    }
    emitTriggerFunction(action, e, el) {
        let ev = new CustomEvent("trigger_pointer_" + action, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                state: this.state,
                customFcts: this.customFcts,
                realEvent: e
            }
        });
        if (!el) {
            el = this.element;
        }
        el.dispatchEvent(ev);
    }
    /**
     * Destroy the Press instance byremoving all events
     */
    destroy() {
        if (this.element) {
            this.element.removeEventListener("pointerdown", this.functionsBinded.downAction);
            this.element.removeEventListener("trigger_pointer_press", this.functionsBinded.childPress);
            this.element.removeEventListener("trigger_pointer_pressstart", this.functionsBinded.childPressStart);
            this.element.removeEventListener("trigger_pointer_pressend", this.functionsBinded.childPressEnd);
            this.element.removeEventListener("trigger_pointer_dblpress", this.functionsBinded.childDblPress);
            this.element.removeEventListener("trigger_pointer_longpress", this.functionsBinded.childLongPress);
            this.element.removeEventListener("trigger_pointer_dragstart", this.functionsBinded.childDragStart);
        }
    }
}
PressManager.Namespace=`${moduleName}`;
_.PressManager=PressManager;
const Uri=class Uri {
    static prepare(uri) {
        let params = [];
        let i = 0;
        let regexState = uri.replace(/{.*?}/g, (group, position) => {
            group = group.slice(1, -1);
            let splitted = group.split(":");
            let name = splitted[0].trim();
            let type = "string";
            let result = "([^\\/]+)";
            i++;
            if (splitted.length > 1) {
                if (splitted[1].trim() == "number") {
                    result = "([0-9]+)";
                    type = "number";
                }
            }
            params.push({
                name,
                type,
                position: i
            });
            return result;
        });
        regexState = regexState.replace(/\*/g, ".*?").toLowerCase();
        regexState = "^" + regexState + '$';
        return {
            regex: new RegExp(regexState),
            params
        };
    }
    static getParams(from, current) {
        if (typeof from == "string") {
            from = this.prepare(from);
        }
        let matches = from.regex.exec(current);
        if (matches) {
            let slugs = {};
            for (let param of from.params) {
                if (param.type == "number") {
                    slugs[param.name] = Number(matches[param.position]);
                }
                else {
                    slugs[param.name] = matches[param.position];
                }
            }
            return slugs;
        }
        return null;
    }
    static isActive(from, current) {
        if (typeof from == "string") {
            from = this.prepare(from);
        }
        return from.regex.test(current);
    }
}
Uri.Namespace=`${moduleName}`;
_.Uri=Uri;
const State=class State {
    /**
     * Activate a custom state inside a specific manager
     * It ll be a generic state with no information inside exept name
     */
    static async activate(stateName, manager) {
        return await manager.setState(stateName);
    }
    /**
     * Activate this state inside a specific manager
     */
    async activate(manager) {
        return await manager.setState(this);
    }
    onActivate() {
    }
    onInactivate(nextState) {
    }
    async askChange(state, nextState) {
        return true;
    }
}
State.Namespace=`${moduleName}`;
_.State=State;
const EmptyState=class EmptyState extends State {
    localName;
    constructor(stateName) {
        super();
        this.localName = stateName;
    }
    /**
     * @inheritdoc
     */
    get name() {
        return this.localName;
    }
}
EmptyState.Namespace=`${moduleName}`;
_.EmptyState=EmptyState;
const StateManager=class StateManager {
    subscribers = {};
    static canBeActivate(statePattern, stateName) {
        let stateInfo = Uri.prepare(statePattern);
        return stateInfo.regex.test(stateName);
    }
    activeState;
    changeStateMutex = new Mutex();
    afterStateChanged = new Callback();
    /**
     * Subscribe actions for a state or a state list
     */
    subscribe(statePatterns, callbacks) {
        if (!callbacks.active && !callbacks.inactive && !callbacks.askChange) {
            this._log(`Trying to subscribe to state : ${statePatterns} with no callbacks !`, "warning");
            return;
        }
        if (!Array.isArray(statePatterns)) {
            statePatterns = [statePatterns];
        }
        for (let statePattern of statePatterns) {
            if (!this.subscribers.hasOwnProperty(statePattern)) {
                let res = Uri.prepare(statePattern);
                let isActive = this.activeState !== undefined && res.regex.test(this.activeState.name);
                this.subscribers[statePattern] = {
                    "regex": res.regex,
                    "params": res.params,
                    "callbacks": {
                        "active": [],
                        "inactive": [],
                        "askChange": [],
                    },
                    "isActive": isActive,
                };
            }
            if (callbacks.active) {
                if (!Array.isArray(callbacks.active)) {
                    callbacks.active = [callbacks.active];
                }
                for (let activeFct of callbacks.active) {
                    this.subscribers[statePattern].callbacks.active.push(activeFct);
                    if (this.subscribers[statePattern].isActive && this.activeState) {
                        let slugs = Uri.getParams(this.subscribers[statePattern], this.activeState.name);
                        if (slugs) {
                            activeFct(this.activeState, slugs);
                        }
                    }
                }
            }
            if (callbacks.inactive) {
                if (!Array.isArray(callbacks.inactive)) {
                    callbacks.inactive = [callbacks.inactive];
                }
                for (let inactiveFct of callbacks.inactive) {
                    this.subscribers[statePattern].callbacks.inactive.push(inactiveFct);
                }
            }
            if (callbacks.askChange) {
                if (!Array.isArray(callbacks.askChange)) {
                    callbacks.askChange = [callbacks.askChange];
                }
                for (let askChangeFct of callbacks.askChange) {
                    this.subscribers[statePattern].callbacks.askChange.push(askChangeFct);
                }
            }
        }
    }
    /**
     * Unsubscribe actions for a state or a state list
     */
    unsubscribe(statePatterns, callbacks) {
        if (!callbacks.active && !callbacks.inactive && !callbacks.askChange) {
            this._log(`Trying to unsubscribe to state : ${statePatterns} with no callbacks !`, "warning");
            return;
        }
        if (!Array.isArray(statePatterns)) {
            statePatterns = [statePatterns];
        }
        for (let statePattern of statePatterns) {
            if (this.subscribers[statePattern]) {
                if (callbacks.active) {
                    if (!Array.isArray(callbacks.active)) {
                        callbacks.active = [callbacks.active];
                    }
                    for (let activeFct of callbacks.active) {
                        let index = this.subscribers[statePattern].callbacks.active.indexOf(activeFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.active.splice(index, 1);
                        }
                    }
                }
                if (callbacks.inactive) {
                    if (!Array.isArray(callbacks.inactive)) {
                        callbacks.inactive = [callbacks.inactive];
                    }
                    for (let inactiveFct of callbacks.inactive) {
                        let index = this.subscribers[statePattern].callbacks.inactive.indexOf(inactiveFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.inactive.splice(index, 1);
                        }
                    }
                }
                if (callbacks.askChange) {
                    if (!Array.isArray(callbacks.askChange)) {
                        callbacks.askChange = [callbacks.askChange];
                    }
                    for (let askChangeFct of callbacks.askChange) {
                        let index = this.subscribers[statePattern].callbacks.askChange.indexOf(askChangeFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.askChange.splice(index, 1);
                        }
                    }
                }
                if (this.subscribers[statePattern].callbacks.active.length === 0 &&
                    this.subscribers[statePattern].callbacks.inactive.length === 0 &&
                    this.subscribers[statePattern].callbacks.askChange.length === 0) {
                    delete this.subscribers[statePattern];
                }
            }
        }
    }
    onAfterStateChanged(cb) {
        this.afterStateChanged.add(cb);
    }
    offAfterStateChanged(cb) {
        this.afterStateChanged.remove(cb);
    }
    assignDefaultState(stateName) {
        return new EmptyState(stateName);
    }
    /**
     * Activate a current state
     */
    async setState(state) {
        let result = await this.changeStateMutex.safeRunLastAsync(async () => {
            let stateToUse;
            if (typeof state == "string") {
                stateToUse = this.assignDefaultState(state);
            }
            else {
                stateToUse = state;
            }
            if (!stateToUse) {
                this._log("state is undefined", "error");
                this.changeStateMutex.release();
                return false;
            }
            let canChange = true;
            if (this.activeState) {
                let activeToInactive = [];
                let inactiveToActive = [];
                let triggerActive = [];
                canChange = await this.activeState.askChange(this.activeState, stateToUse);
                if (canChange) {
                    for (let statePattern in this.subscribers) {
                        let subscriber = this.subscribers[statePattern];
                        if (subscriber.isActive) {
                            let clone = [...subscriber.callbacks.askChange];
                            let currentSlug = Uri.getParams(subscriber, this.activeState.name);
                            if (currentSlug) {
                                for (let i = 0; i < clone.length; i++) {
                                    let askChange = clone[i];
                                    if (!await askChange(this.activeState, stateToUse, currentSlug)) {
                                        canChange = false;
                                        break;
                                    }
                                }
                            }
                            let slugs = Uri.getParams(subscriber, stateToUse.name);
                            if (slugs === null) {
                                activeToInactive.push(subscriber);
                            }
                            else {
                                triggerActive.push({
                                    subscriber: subscriber,
                                    params: slugs
                                });
                            }
                        }
                        else {
                            let slugs = Uri.getParams(subscriber, stateToUse.name);
                            if (slugs) {
                                inactiveToActive.push({
                                    subscriber,
                                    params: slugs
                                });
                            }
                        }
                        if (!canChange) {
                            break;
                        }
                    }
                }
                if (canChange) {
                    const oldState = this.activeState;
                    this.activeState = stateToUse;
                    oldState.onInactivate(stateToUse);
                    for (let subscriber of activeToInactive) {
                        subscriber.isActive = false;
                        let oldSlug = Uri.getParams(subscriber, oldState.name);
                        if (oldSlug) {
                            let oldSlugNotNull = oldSlug;
                            [...subscriber.callbacks.inactive].forEach(callback => {
                                callback(oldState, stateToUse, oldSlugNotNull);
                            });
                        }
                    }
                    for (let trigger of triggerActive) {
                        [...trigger.subscriber.callbacks.active].forEach(callback => {
                            callback(stateToUse, trigger.params);
                        });
                    }
                    for (let trigger of inactiveToActive) {
                        trigger.subscriber.isActive = true;
                        [...trigger.subscriber.callbacks.active].forEach(callback => {
                            callback(stateToUse, trigger.params);
                        });
                    }
                    stateToUse.onActivate();
                }
            }
            else {
                this.activeState = stateToUse;
                for (let key in this.subscribers) {
                    let slugs = Uri.getParams(this.subscribers[key], stateToUse.name);
                    if (slugs) {
                        let slugsNotNull = slugs;
                        this.subscribers[key].isActive = true;
                        [...this.subscribers[key].callbacks.active].forEach(callback => {
                            callback(stateToUse, slugsNotNull);
                        });
                    }
                }
                stateToUse.onActivate();
            }
            this.afterStateChanged.trigger([]);
            return true;
        });
        return result ?? false;
    }
    getState() {
        return this.activeState;
    }
    /**
     * Check if a state is in the subscribers and active, return true if it is, false otherwise
     */
    isStateActive(statePattern) {
        return Uri.isActive(statePattern, this.activeState?.name ?? '');
    }
    /**
     * Get slugs information for the current state, return null if state isn't active
     */
    getStateSlugs(statePattern) {
        return Uri.getParams(statePattern, this.activeState?.name ?? '');
    }
    // 0 = error only / 1 = errors and warning / 2 = error, warning and logs (not implemented)
    logLevel() {
        return 0;
    }
    _log(msg, type) {
        if (type === "error") {
            console.error(msg);
        }
        else if (type === "warning" && this.logLevel() > 0) {
            console.warn(msg);
        }
        else if (type === "info" && this.logLevel() > 1) {
            console.log(msg);
        }
    }
}
StateManager.Namespace=`${moduleName}`;
_.StateManager=StateManager;
const Effect=class Effect {
    callbacks = [];
    isInit = false;
    __subscribes = [];
    fct;
    constructor(fct) {
        this.fct = fct;
        if (this.autoInit()) {
            this.init();
        }
    }
    autoInit() {
        return true;
    }
    init() {
        this.isInit = true;
        Watcher._registering.push(this);
        this.fct();
        Watcher._registering.splice(Watcher._registering.length - 1, 1);
    }
    register(receiver, path) {
        const cb = (action, changePath, value) => {
            if (path == changePath) {
                this.onChange();
            }
        };
        for (let info of this.callbacks) {
            if (info.receiver == receiver && info.path == path) {
                return;
            }
        }
        this.callbacks.push({
            receiver,
            path,
            cb
        });
        receiver.__subscribe(cb);
    }
    onChange() {
        this.fct();
        for (let fct of this.__subscribes) {
            fct(WatchAction.UPDATED, "", undefined);
        }
    }
    destroy() {
        for (let pair of this.callbacks) {
            pair.receiver.__unsubscribe(pair.cb);
        }
        this.callbacks = [];
        this.isInit = false;
    }
    __subscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index == -1) {
            this.__subscribes.push(fct);
        }
    }
    __unsubscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index > -1) {
            this.__subscribes.splice(index, 1);
        }
    }
}
Effect.Namespace=`${moduleName}`;
_.Effect=Effect;
const Computed=class Computed extends Effect {
    _value;
    get value() {
        if (!this.isInit) {
            this.init();
        }
        Watcher._register?.register(this, "");
        return this._value;
    }
    autoInit() {
        return false;
    }
    constructor(fct) {
        super(fct);
    }
    init() {
        this.isInit = true;
        Watcher._registering.push(this);
        this._value = this.fct();
        Watcher._registering.splice(Watcher._registering.length - 1, 1);
    }
    onChange() {
        this._value = this.fct();
        for (let fct of this.__subscribes) {
            fct(WatchAction.UPDATED, "", this._value);
        }
    }
}
Computed.Namespace=`${moduleName}`;
_.Computed=Computed;
const Watcher=class Watcher {
    static __maxProxyData = 0;
    static _registering = [];
    static get _register() {
        return this._registering[this._registering.length - 1];
    }
    /**
     * Transform object into a watcher
     */
    static get(obj, onDataChanged) {
        if (obj == undefined) {
            console.error("You must define an objet / array for your proxy");
            return;
        }
        if (obj.__isProxy) {
            obj.__subscribe(onDataChanged);
            return obj;
        }
        Watcher.__maxProxyData++;
        const reservedName = {
            __path: '__path',
            __proxyData: '__proxyData',
        };
        let setProxyPath = (newProxy, newPath) => {
            if (newProxy instanceof Object && newProxy.__isProxy) {
                newProxy.__path = newPath;
                if (!newProxy.__proxyData) {
                    newProxy.__proxyData = {};
                }
                if (!newProxy.__proxyData[newPath]) {
                    newProxy.__proxyData[newPath] = [];
                }
                if (newProxy.__proxyData[newPath].indexOf(proxyData) == -1) {
                    newProxy.__proxyData[newPath].push(proxyData);
                }
            }
        };
        let removeProxyPath = (oldValue, pathToDelete, recursive = true) => {
            if (oldValue instanceof Object && oldValue.__isProxy) {
                let allProxies = oldValue.__proxyData;
                for (let triggerPath in allProxies) {
                    if (triggerPath == pathToDelete) {
                        for (let i = 0; i < allProxies[triggerPath].length; i++) {
                            if (allProxies[triggerPath][i] == proxyData) {
                                allProxies[triggerPath].splice(i, 1);
                                i--;
                            }
                        }
                        if (allProxies[triggerPath].length == 0) {
                            delete allProxies[triggerPath];
                            if (Object.keys(allProxies).length == 0) {
                                delete oldValue.__proxyData;
                            }
                        }
                    }
                }
            }
        };
        let jsonReplacer = (key, value) => {
            if (reservedName[key])
                return undefined;
            return value;
        };
        let currentTrace = new Error().stack?.split("\n") ?? [];
        currentTrace.shift();
        currentTrace.shift();
        let onlyDuringInit = true;
        let proxyData = {
            baseData: {},
            id: Watcher.__maxProxyData,
            callbacks: [onDataChanged],
            avoidUpdate: [],
            pathToRemove: [],
            history: [{
                    object: JSON.parse(JSON.stringify(obj, jsonReplacer)),
                    trace: currentTrace,
                    action: 'init',
                    path: ''
                }],
            useHistory: false,
            getProxyObject(target, element, prop) {
                let newProxy;
                if (element instanceof Object && element.__isProxy) {
                    newProxy = element;
                }
                else {
                    try {
                        if (element instanceof Computed) {
                            return element;
                        }
                        if (element instanceof Object) {
                            newProxy = new Proxy(element, this);
                        }
                        else {
                            return element;
                        }
                    }
                    catch {
                        return element;
                    }
                }
                let newPath = '';
                if (Array.isArray(target)) {
                    if (prop != "length") {
                        if (target.__path) {
                            newPath = target.__path;
                        }
                        newPath += "[" + prop + "]";
                        setProxyPath(newProxy, newPath);
                    }
                }
                else if (element instanceof Date) {
                    return element;
                }
                else {
                    if (target.__path) {
                        newPath = target.__path + '.';
                    }
                    newPath += prop;
                    setProxyPath(newProxy, newPath);
                }
                return newProxy;
            },
            tryCustomFunction(target, prop, receiver) {
                if (prop == "__isProxy") {
                    return true;
                }
                else if (prop == "__subscribe") {
                    return (cb) => {
                        this.callbacks.push(cb);
                    };
                }
                else if (prop == "__unsubscribe") {
                    return (cb) => {
                        let index = this.callbacks.indexOf(cb);
                        if (index > -1) {
                            this.callbacks.splice(index, 1);
                        }
                    };
                }
                else if (prop == "__proxyId") {
                    return this.id;
                }
                else if (prop == "getHistory") {
                    return () => {
                        return this.history;
                    };
                }
                else if (prop == "clearHistory") {
                    this.history = [];
                }
                else if (prop == "enableHistory") {
                    return () => {
                        this.useHistory = true;
                    };
                }
                else if (prop == "disableHistory") {
                    return () => {
                        this.useHistory = false;
                    };
                }
                else if (prop == "__getTarget" && onlyDuringInit) {
                    return () => {
                        return target;
                    };
                }
                else if (prop == "toJSON") {
                    return () => {
                        let result = {};
                        for (let key of Object.keys(target)) {
                            if (reservedName[key]) {
                                continue;
                            }
                            result[key] = target[key];
                        }
                        return result;
                    };
                }
                return undefined;
            },
            get(target, prop, receiver) {
                if (reservedName[prop]) {
                    return target[prop];
                }
                let customResult = this.tryCustomFunction(target, prop, receiver);
                if (customResult !== undefined) {
                    return customResult;
                }
                let element = target[prop];
                if (typeof (element) == 'function') {
                    if (Array.isArray(target)) {
                        let result;
                        if (prop == 'push') {
                            if (target.__isProxy) {
                                result = (el) => {
                                    let index = target.push(el);
                                    return index;
                                };
                            }
                            else {
                                result = (el) => {
                                    let index = target.push(el);
                                    let proxyEl = this.getProxyObject(target, el, (index - 1));
                                    target.splice(target.length - 1, 1, proxyEl);
                                    trigger('CREATED', target, receiver, proxyEl, "[" + (index - 1) + "]");
                                    return index;
                                };
                            }
                        }
                        else if (prop == 'splice') {
                            if (target.__isProxy) {
                                result = (index, nbRemove, ...insert) => {
                                    let res = target.splice(index, nbRemove, ...insert);
                                    return res;
                                };
                            }
                            else {
                                result = (index, nbRemove, ...insert) => {
                                    let res = target.splice(index, nbRemove, ...insert);
                                    let path = target.__path ? target.__path : '';
                                    for (let i = 0; i < res.length; i++) {
                                        trigger('DELETED', target, receiver, res[i], "[" + index + "]");
                                        removeProxyPath(res[i], path + "[" + (index + i) + "]");
                                    }
                                    for (let i = 0; i < insert.length; i++) {
                                        let proxyEl = this.getProxyObject(target, insert[i], (index + i));
                                        target.splice((index + i), 1, proxyEl);
                                        trigger('CREATED', target, receiver, proxyEl, "[" + (index + i) + "]");
                                    }
                                    let fromIndex = index + insert.length;
                                    let baseDiff = index - insert.length + res.length + 1;
                                    for (let i = fromIndex, j = 0; i < target.length; i++, j++) {
                                        let oldPath = path + "[" + (j + baseDiff) + "]";
                                        removeProxyPath(target[i], oldPath, false);
                                        let proxyEl = this.getProxyObject(target, target[i], i);
                                        let recuUpdate = (childEl) => {
                                            if (Array.isArray(childEl)) {
                                                for (let i = 0; i < childEl.length; i++) {
                                                    if (childEl[i] instanceof Object && childEl[i].__path) {
                                                        let oldPathRecu = proxyEl[i].__path.replace(proxyEl.__path, oldPath);
                                                        removeProxyPath(childEl[i], oldPathRecu, false);
                                                        let newProxyEl = this.getProxyObject(childEl, childEl[i], i);
                                                        recuUpdate(newProxyEl);
                                                    }
                                                }
                                            }
                                            else if (childEl instanceof Object && !(childEl instanceof Date)) {
                                                for (let key in childEl) {
                                                    if (childEl[key] instanceof Object && childEl[key].__path) {
                                                        let oldPathRecu = proxyEl[key].__path.replace(proxyEl.__path, oldPath);
                                                        removeProxyPath(childEl[key], oldPathRecu, false);
                                                        let newProxyEl = this.getProxyObject(childEl, childEl[key], key);
                                                        recuUpdate(newProxyEl);
                                                    }
                                                }
                                            }
                                        };
                                        recuUpdate(proxyEl);
                                    }
                                    return res;
                                };
                            }
                        }
                        else if (prop == 'pop') {
                            if (target.__isProxy) {
                                result = () => {
                                    let res = target.pop();
                                    return res;
                                };
                            }
                            else {
                                result = () => {
                                    let index = target.length - 1;
                                    let res = target.pop();
                                    let path = target.__path ? target.__path : '';
                                    trigger('DELETED', target, receiver, res, "[" + index + "]");
                                    removeProxyPath(res, path + "[" + index + "]");
                                    return res;
                                };
                            }
                        }
                        else {
                            result = element.bind(target);
                        }
                        return result;
                    }
                    return element.bind(target);
                }
                if (element instanceof Computed) {
                    return element.value;
                }
                if (typeof (element) == 'object') {
                    if (Watcher._registering.length > 0) {
                        const currentPath = receiver.__path ? receiver.__path + '.' + prop : prop;
                        Watcher._register?.register(receiver, currentPath);
                    }
                    return this.getProxyObject(target, element, prop);
                }
                let resultTemp = Reflect.get(target, prop, receiver);
                if (Watcher._registering.length > 0) {
                    const currentPath = receiver.__path ? receiver.__path + '.' + prop : prop;
                    Watcher._register?.register(receiver, currentPath);
                }
                return resultTemp;
            },
            set(target, prop, value, receiver) {
                let triggerChange = false;
                if (!reservedName[prop]) {
                    if (Array.isArray(target)) {
                        if (prop != "length") {
                            triggerChange = true;
                        }
                    }
                    else {
                        let oldValue = Reflect.get(target, prop, receiver);
                        if (!compareObject(value, oldValue)) {
                            triggerChange = true;
                        }
                    }
                }
                let result = Reflect.set(target, prop, value, receiver);
                if (triggerChange) {
                    let index = this.avoidUpdate.indexOf(prop);
                    if (index == -1) {
                        trigger('UPDATED', target, receiver, value, prop);
                    }
                    else {
                        this.avoidUpdate.splice(index, 1);
                    }
                }
                return result;
            },
            deleteProperty(target, prop) {
                let triggerChange = false;
                let pathToDelete = '';
                if (!reservedName[prop]) {
                    if (Array.isArray(target)) {
                        if (prop != "length") {
                            if (target.__path) {
                                pathToDelete = target.__path;
                            }
                            pathToDelete += "[" + prop + "]";
                            triggerChange = true;
                        }
                    }
                    else {
                        if (target.__path) {
                            pathToDelete = target.__path + '.';
                        }
                        pathToDelete += prop;
                        triggerChange = true;
                    }
                }
                if (target.hasOwnProperty(prop)) {
                    let oldValue = target[prop];
                    if (oldValue instanceof Effect) {
                        oldValue.destroy();
                    }
                    delete target[prop];
                    if (triggerChange) {
                        trigger('DELETED', target, null, oldValue, prop);
                        removeProxyPath(oldValue, pathToDelete);
                    }
                    return true;
                }
                return false;
            },
            defineProperty(target, prop, descriptor) {
                let triggerChange = false;
                let newPath = '';
                if (!reservedName[prop]) {
                    if (Array.isArray(target)) {
                        if (prop != "length") {
                            if (target.__path) {
                                newPath = target.__path;
                            }
                            newPath += "[" + prop + "]";
                            if (!target.hasOwnProperty(prop)) {
                                triggerChange = true;
                            }
                        }
                    }
                    else {
                        if (target.__path) {
                            newPath = target.__path + '.';
                        }
                        newPath += prop;
                        if (!target.hasOwnProperty(prop)) {
                            triggerChange = true;
                        }
                    }
                }
                let result = Reflect.defineProperty(target, prop, descriptor);
                if (triggerChange) {
                    this.avoidUpdate.push(prop);
                    let proxyEl = this.getProxyObject(target, descriptor.value, prop);
                    target[prop] = proxyEl;
                    trigger('CREATED', target, null, proxyEl, prop);
                }
                return result;
            },
            ownKeys(target) {
                let result = Reflect.ownKeys(target);
                for (let i = 0; i < result.length; i++) {
                    if (reservedName[result[i]]) {
                        result.splice(i, 1);
                        i--;
                    }
                }
                return result;
            },
        };
        const trigger = (type, target, receiver, value, prop) => {
            if (target.__isProxy) {
                return;
            }
            let allProxies = target.__proxyData;
            let receiverId = 0;
            if (receiver == null) {
                receiverId = proxyData.id;
            }
            else {
                receiverId = receiver.__proxyId;
            }
            if (proxyData.id == receiverId) {
                let stacks = [];
                if (proxyData.useHistory) {
                    let allStacks = new Error().stack?.split("\n") ?? [];
                    for (let i = allStacks.length - 1; i >= 0; i--) {
                        let current = allStacks[i].trim().replace("at ", "");
                        if (current.startsWith("Object.set") || current.startsWith("Proxy.result")) {
                            break;
                        }
                        stacks.push(current);
                    }
                }
                for (let triggerPath in allProxies) {
                    for (let currentProxyData of allProxies[triggerPath]) {
                        let pathToSend = triggerPath;
                        if (pathToSend != "") {
                            if (Array.isArray(target)) {
                                if (!prop.startsWith("[")) {
                                    pathToSend += "[" + prop + "]";
                                }
                                else {
                                    pathToSend += prop;
                                }
                            }
                            else {
                                if (!prop.startsWith("[")) {
                                    pathToSend += ".";
                                }
                                pathToSend += prop;
                            }
                        }
                        else {
                            pathToSend = prop;
                        }
                        if (proxyData.useHistory) {
                            proxyData.history.push({
                                object: JSON.parse(JSON.stringify(currentProxyData.baseData, jsonReplacer)),
                                trace: stacks.reverse(),
                                action: WatchAction[type],
                                path: pathToSend
                            });
                        }
                        [...currentProxyData.callbacks].forEach((cb) => {
                            cb(WatchAction[type], pathToSend, value);
                        });
                    }
                }
            }
        };
        var realProxy = new Proxy(obj, proxyData);
        proxyData.baseData = realProxy.__getTarget();
        onlyDuringInit = false;
        setProxyPath(realProxy, '');
        return realProxy;
    }
    static computed(fct) {
        const comp = new Computed(fct);
        return comp;
    }
    static effect(fct) {
        const comp = new Effect(fct);
        return comp;
    }
}
Watcher.Namespace=`${moduleName}`;
_.Watcher=Watcher;
const WebComponentTemplateContext=class WebComponentTemplateContext {
    __changes = {};
    component;
    fctsToRemove = [];
    c = {
        __P: (value) => {
            return value == null ? "" : value + "";
        }
    };
    isRendered = false;
    schema;
    constructor(component, schema, locals) {
        this.component = component;
        this.schema = { ...schema };
        for (let key in locals) {
            this.schema.locals[key] = locals[key];
        }
        this.buildSchema();
    }
    destructor() {
        for (let toRemove of this.fctsToRemove) {
            let index = this.component.__onChangeFct[toRemove.name].indexOf(toRemove.fct);
            if (index != -1) {
                this.component.__onChangeFct[toRemove.name].splice(index, 1);
            }
        }
    }
    buildSchema() {
        for (let global of this.schema.globals) {
            this.createGlobal(global);
        }
        for (let item in this.schema.loops) {
            this.createLoop(item, this.schema.loops[item].index, this.schema.loops[item].data);
        }
        for (let key in this.schema.locals) {
            this.createLocal(key, this.schema.locals[key]);
        }
    }
    createGlobal(global) {
        let comp = this.component;
        Object.defineProperty(this.c, global, {
            get() {
                return WebComponentTemplate.getValueFromItem(global, comp);
            },
            set(value) {
                WebComponentTemplate.setValueToItem(global, comp, value);
            }
        });
        let name = global.split(".")[0];
        this.__changes[name] = [];
        if (!this.component.__onChangeFct[name]) {
            this.component.__onChangeFct[name] = [];
        }
        let fct = (path) => {
            if (this.isRendered) {
                for (let change of this.__changes[name]) {
                    change(path);
                }
            }
        };
        this.fctsToRemove.push({ name, fct });
        this.component.__onChangeFct[name].push(fct);
    }
    createLoop(item, index, data) {
        Object.defineProperty(this.c, item, {
            get() {
                let indexValue = this[index];
                return WebComponentTemplate.getValueFromItem(data, this)[indexValue];
            }
        });
        let name = data.split(".")[0];
        this.__changes[item] = [];
        this.__changes[name].push((path) => {
            if (this.isRendered) {
                let currentPath = `${data}[${this.c[index]}]`;
                if (path.startsWith(currentPath)) {
                    let localPath = path.replace(currentPath, item);
                    for (let change of this.__changes[item]) {
                        change(localPath);
                    }
                }
            }
        });
    }
    createLocal(key, value) {
        let changes = this.__changes;
        let v = value;
        Object.defineProperty(this.c, key, {
            get() {
                return v;
            },
            set(value) {
                v = value;
                if (changes[key]) {
                    for (let change of changes[key]) {
                        change(key);
                    }
                }
            }
        });
    }
    addChange(on, fct) {
        if (!this.__changes[on]) {
            this.__changes[on] = [];
        }
        this.__changes[on].push(fct);
    }
}
WebComponentTemplateContext.Namespace=`${moduleName}`;
_.WebComponentTemplateContext=WebComponentTemplateContext;
const WebComponentTemplateInstance=class WebComponentTemplateInstance {
    context;
    content;
    actions;
    component;
    _components = {};
    firstRenderUniqueCb = {};
    firstRenderCb = [];
    fctsToRemove = [];
    loopRegisteries = {};
    firstChild;
    lastChild;
    loops = [];
    constructor(context, content, actions, component, loops) {
        this.context = context;
        this.content = content;
        this.actions = actions;
        this.component = component;
        this.loops = loops;
        this.firstChild = content.firstChild;
        this.lastChild = content.lastChild;
        this.selectElements();
        this.transformActionsListening();
    }
    render() {
        this.bindEvents();
        for (let cb of this.firstRenderCb) {
            cb();
        }
        for (let key in this.firstRenderUniqueCb) {
            this.firstRenderUniqueCb[key]();
        }
        this.renderSubTemplate();
        this.context.isRendered = true;
    }
    destructor() {
        this.firstChild.remove();
        this.context.destructor();
        for (let toRemove of this.fctsToRemove) {
            let index = this.component.__watchActions[toRemove.name].indexOf(toRemove.fct);
            if (index != -1) {
                this.component.__watchActions[toRemove.name].splice(index, 1);
            }
        }
    }
    selectElements() {
        this._components = {};
        let idEls = Array.from(this.content.querySelectorAll('[_id]'));
        for (let idEl of idEls) {
            let id = idEl.attributes['_id'].value;
            if (!this._components[id]) {
                this._components[id] = [];
            }
            this._components[id].push(idEl);
        }
        if (this.actions.elements) {
            for (let element of this.actions.elements) {
                let components = [];
                for (let id of element.ids) {
                    if (this._components[id]) {
                        components = [...components, ...this._components[id]];
                    }
                }
                if (element.isArray) {
                    WebComponentTemplate.setValueToItem(element.name, this.component, components);
                }
                else if (components[0]) {
                    WebComponentTemplate.setValueToItem(element.name, this.component, components[0]);
                }
            }
        }
    }
    bindEvents() {
        if (this.actions.events) {
            for (let event of this.actions.events) {
                this.bindEvent(event);
            }
        }
        if (this.actions.pressEvents) {
            for (let event of this.actions.pressEvents) {
                this.bindPressEvent(event);
            }
        }
    }
    bindEvent(event) {
        if (!this._components[event.id]) {
            return;
        }
        if (event.isCallback) {
            for (let el of this._components[event.id]) {
                let cb = WebComponentTemplate.getValueFromItem(event.eventName, el);
                cb?.add((...args) => {
                    event.fct(this.context, args);
                });
            }
        }
        else {
            for (let el of this._components[event.id]) {
                el.addEventListener(event.eventName, (e) => { event.fct(e, this.context); });
            }
        }
    }
    bindPressEvent(event) {
        let id = event['id'];
        if (id && this._components[id]) {
            let clone = {};
            for (let temp in event) {
                if (temp != 'id') {
                    if (event[temp] instanceof Function) {
                        clone[temp] = (e, pressInstance) => { event[temp](e, pressInstance, this.context); };
                    }
                    else {
                        clone[temp] = event[temp];
                    }
                }
            }
            clone.element = this._components[id];
            PressManager.create(clone);
        }
    }
    transformActionsListening() {
        if (this.actions.content) {
            for (let name in this.actions.content) {
                for (let change of this.actions.content[name]) {
                    this.transformChangeAction(name, change);
                }
            }
        }
        if (this.actions.injection) {
            for (let name in this.actions.injection) {
                for (let injection of this.actions.injection[name]) {
                    this.transformInjectionAction(name, injection);
                }
            }
        }
        if (this.actions.bindings) {
            for (let name in this.actions.bindings) {
                for (let binding of this.actions.bindings[name]) {
                    this.transformBindigAction(name, binding);
                }
            }
        }
    }
    transformChangeAction(name, change) {
        if (!this._components[change.id])
            return;
        let key = change.id + "_" + change.attrName;
        if (change.attrName == "@HTML") {
            if (change.path) {
                this.context.addChange(name, (path) => {
                    if (WebComponentTemplate.validatePath(path, change.path ?? '')) {
                        for (const el of this._components[change.id]) {
                            el.innerHTML = change.render(this.context.c);
                        }
                    }
                });
            }
            else {
                this.context.addChange(name, (path) => {
                    for (const el of this._components[change.id]) {
                        el.innerHTML = change.render(this.context.c);
                    }
                });
            }
            if (!this.firstRenderUniqueCb[key]) {
                this.firstRenderUniqueCb[key] = () => {
                    for (const el of this._components[change.id]) {
                        el.innerHTML = change.render(this.context.c);
                    }
                };
            }
        }
        else if (change.isBool) {
            this.context.addChange(name, () => {
                for (const el of this._components[change.id]) {
                    if (this.context.c[name]) {
                        el.setAttribute(change.attrName, "true");
                    }
                    else {
                        el.removeAttribute(change.attrName);
                    }
                }
            });
            if (!this.firstRenderUniqueCb[key]) {
                this.firstRenderUniqueCb[key] = () => {
                    for (const el of this._components[change.id]) {
                        if (this.context.c[name]) {
                            el.setAttribute(change.attrName, "true");
                        }
                        else {
                            el.removeAttribute(change.attrName);
                        }
                    }
                };
            }
        }
        else {
            if (change.path) {
                this.context.addChange(name, (path) => {
                    if (WebComponentTemplate.validatePath(path, change.path ?? '')) {
                        for (const el of this._components[change.id]) {
                            el.setAttribute(change.attrName, change.render(this.context.c));
                        }
                    }
                });
            }
            else {
                this.context.addChange(name, (path) => {
                    for (const el of this._components[change.id]) {
                        el.setAttribute(change.attrName, change.render(this.context.c));
                    }
                });
            }
            if (!this.firstRenderUniqueCb[key]) {
                this.firstRenderUniqueCb[key] = () => {
                    for (const el of this._components[change.id]) {
                        el.setAttribute(change.attrName, change.render(this.context.c));
                    }
                };
            }
        }
    }
    transformInjectionAction(name, injection) {
        if (!this._components[injection.id])
            return;
        if (injection.path) {
            this.context.addChange(name, (path) => {
                if (WebComponentTemplate.validatePath(path, injection.path ?? '')) {
                    for (const el of this._components[injection.id]) {
                        el[injection.injectionName] = injection.inject(this.context.c);
                    }
                }
            });
        }
        else {
            this.context.addChange(name, (path) => {
                for (const el of this._components[injection.id]) {
                    el[injection.injectionName] = injection.inject(this.context.c);
                }
            });
        }
        this.firstRenderCb.push(() => {
            for (const el of this._components[injection.id]) {
                el[injection.injectionName] = injection.inject(this.context.c);
            }
        });
    }
    transformBindigAction(name, binding) {
        if (!this._components[binding.id])
            return;
        if (binding.path) {
            this.context.addChange(name, (path) => {
                let bindingPath = binding.path ?? '';
                if (WebComponentTemplate.validatePath(path, bindingPath)) {
                    let valueToSet = WebComponentTemplate.getValueFromItem(bindingPath, this.context.c);
                    for (const el of this._components[binding.id]) {
                        WebComponentTemplate.setValueToItem(binding.valueName, el, valueToSet);
                    }
                }
            });
        }
        else {
            binding.path = name;
            this.context.addChange(name, (path) => {
                let valueToSet = WebComponentTemplate.getValueFromItem(name, this.context.c);
                for (const el of this._components[binding.id]) {
                    WebComponentTemplate.setValueToItem(binding.valueName, el, valueToSet);
                }
            });
        }
        if (binding.isCallback) {
            this.firstRenderCb.push(() => {
                for (var el of this._components[binding.id]) {
                    for (let fct of binding.eventNames) {
                        let cb = WebComponentTemplate.getValueFromItem(fct, el);
                        cb?.add((value) => {
                            WebComponentTemplate.setValueToItem(binding.path ?? '', this.context.c, value);
                        });
                    }
                    let valueToSet = WebComponentTemplate.getValueFromItem(binding.path ?? '', this.context.c);
                    WebComponentTemplate.setValueToItem(binding.valueName, el, valueToSet);
                }
            });
        }
        else {
            this.firstRenderCb.push(() => {
                for (var el of this._components[binding.id]) {
                    for (let fct of binding.eventNames) {
                        el.addEventListener(fct, (e) => {
                            let valueToSet = WebComponentTemplate.getValueFromItem(binding.valueName, e.target);
                            WebComponentTemplate.setValueToItem(binding.path ?? '', this.context.c, valueToSet);
                        });
                    }
                    let valueToSet = WebComponentTemplate.getValueFromItem(binding.path ?? '', this.context.c);
                    WebComponentTemplate.setValueToItem(binding.valueName, el, valueToSet);
                }
            });
        }
    }
    renderSubTemplate() {
        for (let loop of this.loops) {
            let localContext = JSON.parse(JSON.stringify(this.context.schema));
            localContext.loops[loop.item] = {
                data: loop.data,
                index: loop.index,
            };
            this.renderLoop(loop, localContext);
            this.registerLoopWatchEvent(loop, localContext);
        }
    }
    renderLoop(loop, localContext) {
        if (this.loopRegisteries[loop.anchorId]) {
            for (let item of this.loopRegisteries[loop.anchorId]) {
                item.destructor();
            }
        }
        this.loopRegisteries[loop.anchorId] = [];
        let result = WebComponentTemplate.getValueFromItem(loop.data, this.context.c);
        let anchor = this._components[loop.anchorId][0];
        for (let i = 0; i < result.length; i++) {
            let context = new WebComponentTemplateContext(this.component, localContext, { [loop.index]: i });
            let content = loop.template.template?.content.cloneNode(true);
            let actions = loop.template.actions;
            let instance = new WebComponentTemplateInstance(context, content, actions, this.component, loop.template.loops);
            instance.render();
            anchor.parentNode?.insertBefore(instance.content, anchor);
            this.loopRegisteries[loop.anchorId].push(instance);
        }
    }
    registerLoopWatchEvent(loop, localContext) {
        let fullPath = loop.data;
        let watchName = fullPath.split(".")[0];
        if (!this.component.__watchActions[watchName]) {
            this.component.__watchActions[watchName] = [];
        }
        let regex = new RegExp(fullPath.replace(/\./g, "\\.") + "\\[(\\d+?)\\]$");
        this.component.__watchActions[watchName].push((element, action, path, value) => {
            if (path == fullPath) {
                this.renderLoop(loop, localContext);
                return;
            }
            regex.lastIndex = 0;
            let result = regex.exec(path);
            if (result) {
                let registry = this.loopRegisteries[loop.anchorId];
                let index = Number(result[1]);
                if (action == WatchAction.CREATED) {
                    let context = new WebComponentTemplateContext(this.component, localContext, { [loop.index]: index });
                    let content = loop.template.template?.content.cloneNode(true);
                    let actions = loop.template.actions;
                    let instance = new WebComponentTemplateInstance(context, content, actions, this.component, loop.template.loops);
                    instance.render();
                    let anchor;
                    if (index < registry.length) {
                        anchor = registry[index].firstChild;
                    }
                    else {
                        anchor = this._components[loop.anchorId][0];
                    }
                    anchor.parentNode?.insertBefore(instance.content, anchor);
                    registry.splice(index, 0, instance);
                    for (let i = index + 1; i < registry.length; i++) {
                        registry[i].context.c[loop.index] = registry[i].context.c[loop.index] + 1;
                    }
                }
                else if (action == WatchAction.UPDATED) {
                    registry[index].render();
                }
                else if (action == WatchAction.DELETED) {
                    registry[index].destructor();
                    registry.splice(index, 1);
                    for (let i = index; i < registry.length; i++) {
                        registry[i].context.c[loop.index] = registry[i].context.c[loop.index] - 1;
                    }
                }
            }
        });
    }
}
WebComponentTemplateInstance.Namespace=`${moduleName}`;
_.WebComponentTemplateInstance=WebComponentTemplateInstance;
const WebComponentTemplate=class WebComponentTemplate {
    static setValueToItem(path, obj, value) {
        let splitted = path.split(".");
        for (let i = 0; i < splitted.length - 1; i++) {
            let split = splitted[i];
            if (!obj[split]) {
                obj[split] = {};
            }
            obj = obj[split];
        }
        obj[splitted[splitted.length - 1]] = value;
    }
    static getValueFromItem(path, obj) {
        let splitted = path.split(".");
        for (let i = 0; i < splitted.length - 1; i++) {
            let split = splitted[i];
            if (!obj[split] || typeof obj[split] !== 'object') {
                return undefined;
            }
            obj = obj[split];
        }
        if (!obj || typeof obj !== 'object') {
            return undefined;
        }
        return obj[splitted[splitted.length - 1]];
    }
    static validatePath(path, pathToCheck) {
        if (pathToCheck.startsWith(path)) {
            return true;
        }
        return false;
    }
    cst;
    constructor(component) {
        this.cst = component;
    }
    htmlParts = [];
    setHTML(data) {
        this.htmlParts.push(data);
    }
    generateTemplate() {
        this.template = document.createElement('template');
        let currentHTML = "<slot></slot>";
        let previousSlots = {
            default: '<slot></slot>'
        };
        for (let htmlPart of this.htmlParts) {
            for (let blockName in htmlPart.blocks) {
                if (!previousSlots.hasOwnProperty(blockName)) {
                    throw "can't found slot with name " + blockName;
                }
                currentHTML = currentHTML.replace(previousSlots[blockName], htmlPart.blocks[blockName]);
            }
            for (let slotName in htmlPart.slots) {
                previousSlots[slotName] = htmlPart.slots[slotName];
            }
        }
        this.template.innerHTML = currentHTML;
    }
    setTemplate(template) {
        this.template = document.createElement('template');
        this.template.innerHTML = template;
    }
    contextSchema = {
        globals: [],
        locals: {},
        loops: {}
    };
    template;
    actions = {};
    loops = [];
    setActions(actions) {
        if (!this.actions) {
            this.actions = actions;
        }
        else {
            if (actions.elements) {
                if (!this.actions.elements) {
                    this.actions.elements = [];
                }
                this.actions.elements = [...actions.elements, ...this.actions.elements];
            }
            if (actions.events) {
                if (!this.actions.events) {
                    this.actions.events = [];
                }
                this.actions.events = [...actions.events, ...this.actions.events];
            }
            if (actions.pressEvents) {
                if (!this.actions.pressEvents) {
                    this.actions.pressEvents = [];
                }
                this.actions.pressEvents = [...actions.pressEvents, ...this.actions.pressEvents];
            }
            if (actions.content) {
                if (!this.actions.content) {
                    this.actions.content = actions.content;
                }
                else {
                    for (let contextProp in actions.content) {
                        if (!this.actions.content[contextProp]) {
                            this.actions.content[contextProp] = actions.content[contextProp];
                        }
                        else {
                            this.actions.content[contextProp] = [...actions.content[contextProp], ...this.actions.content[contextProp]];
                        }
                    }
                }
            }
            if (actions.injection) {
                if (!this.actions.injection) {
                    this.actions.injection = actions.injection;
                }
                else {
                    for (let contextProp in actions.injection) {
                        if (!this.actions.injection[contextProp]) {
                            this.actions.injection[contextProp] = actions.injection[contextProp];
                        }
                        else {
                            this.actions.injection[contextProp] = { ...actions.injection[contextProp], ...this.actions.injection[contextProp] };
                        }
                    }
                }
            }
            if (actions.bindings) {
                if (!this.actions.bindings) {
                    this.actions.bindings = actions.bindings;
                }
                else {
                    for (let contextProp in actions.bindings) {
                        if (!this.actions.bindings[contextProp]) {
                            this.actions.bindings[contextProp] = actions.bindings[contextProp];
                        }
                        else {
                            this.actions.bindings[contextProp] = { ...actions.bindings[contextProp], ...this.actions.bindings[contextProp] };
                        }
                    }
                }
            }
        }
    }
    setSchema(contextSchema) {
        if (contextSchema.globals) {
            for (let glob of contextSchema.globals) {
                if (!this.contextSchema.globals.includes(glob)) {
                    this.contextSchema.globals.push(glob);
                }
            }
        }
        if (contextSchema.locals) {
            for (let key in contextSchema.locals) {
                this.contextSchema.locals[key] = contextSchema.locals[key];
            }
        }
        if (contextSchema.loops) {
            for (let key in contextSchema.loops) {
                this.contextSchema.loops[key] = contextSchema.loops[key];
            }
        }
    }
    createInstance(component) {
        let context = new WebComponentTemplateContext(component, this.contextSchema, {});
        let content = this.template?.content.cloneNode(true);
        let actions = this.actions;
        let instance = new WebComponentTemplateInstance(context, content, actions, component, this.loops);
        return instance;
    }
    addLoop(loop) {
        this.loops.push(loop);
    }
}
WebComponentTemplate.Namespace=`${moduleName}`;
_.WebComponentTemplate=WebComponentTemplate;
const WebComponent=class WebComponent extends HTMLElement {
    /**
     * Add attributes informations
     */
    static get observedAttributes() {
        return [];
    }
    _first;
    _isReady;
    /**
     * Determine if the component is ready (postCreation done)
     */
    get isReady() {
        return this._isReady;
    }
    /**
     * The current namespace
     */
    static Namespace = "";
    /**
     * The current Tag / empty if abstract class
     */
    static Tag = "";
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    static get Fullname() { return this.Namespace + "." + this.name; }
    /**
     * The current namespace
     */
    get namespace() {
        return this.constructor['Namespace'];
    }
    /**
     * Get the name of the component class
     */
    getClassName() {
        return this.constructor.name;
    }
    /**
     * The current tag
     */
    get tag() {
        return this.constructor['Tag'];
    }
    /**
    * Get the unique type for the data. Define it as the namespace + class name
    */
    get $type() {
        return this.constructor['Fullname'];
    }
    __onChangeFct = {};
    __watch;
    __watchActions = {};
    __watchActionsCb = {};
    __pressManagers = [];
    __isDefaultState = true;
    __defaultActiveState = new Map();
    __defaultInactiveState = new Map();
    __statesList = {};
    constructor() {
        super();
        if (this.constructor == WebComponent) {
            throw "can't instanciate an abstract class";
        }
        this.__removeNoAnimations = this.__removeNoAnimations.bind(this);
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.__removeNoAnimations);
        }
        this._first = true;
        this._isReady = false;
        this.__renderTemplate();
        this.__registerWatchesActions();
        this.__registerPropertiesActions();
        this.__createStates();
        this.__subscribeState();
    }
    /**
     * Remove all listeners
     * State + press
     */
    destructor() {
        WebComponentInstance.removeInstance(this);
        this.__unsubscribeState();
        for (let press of this.__pressManagers) {
            press.destroy();
        }
        // TODO add missing info for destructor();
    }
    __addWatchesActions(name, fct) {
        if (!this.__watchActions[name]) {
            this.__watchActions[name] = [];
            this.__watchActionsCb[name] = (action, path, value) => {
                for (let fct of this.__watchActions[name]) {
                    fct(this, action, path, value);
                }
                if (this.__onChangeFct[name]) {
                    for (let fct of this.__onChangeFct[name]) {
                        fct(path);
                    }
                }
            };
        }
        if (fct) {
            this.__watchActions[name].push(fct);
        }
    }
    __registerWatchesActions() {
        if (Object.keys(this.__watchActions).length > 0) {
            if (!this.__watch) {
                this.__watch = Watcher.get({}, (type, path, element) => {
                    let action = this.__watchActionsCb[path.split(".")[0]] || this.__watchActionsCb[path.split("[")[0]];
                    action(type, path, element);
                });
            }
        }
    }
    __addPropertyActions(name, fct) {
        if (!this.__onChangeFct[name]) {
            this.__onChangeFct[name] = [];
        }
        if (fct) {
            this.__onChangeFct[name].push(() => {
                fct(this);
            });
        }
    }
    __registerPropertiesActions() { }
    static __style = ``;
    static __template;
    __templateInstance;
    styleBefore(addStyle) {
        addStyle("@general");
    }
    styleAfter(addStyle) {
    }
    __getStyle() {
        return [WebComponent.__style];
    }
    __getHtml() { }
    __getStatic() {
        return WebComponent;
    }
    static __styleSheets = {};
    __renderStyles() {
        let sheets = {};
        const addStyle = (name) => {
            let sheet = Style.get(name);
            if (sheet) {
                sheets[name] = sheet;
            }
        };
        this.styleBefore(addStyle);
        let localStyle = new CSSStyleSheet();
        let styleTxt = this.__getStyle().join("\r\n");
        if (styleTxt.length > 0) {
            localStyle.replace(styleTxt);
            sheets['@local'] = localStyle;
        }
        this.styleAfter(addStyle);
        return sheets;
    }
    __renderTemplate() {
        let staticInstance = this.__getStatic();
        if (!staticInstance.__template || staticInstance.__template.cst != staticInstance) {
            staticInstance.__template = new WebComponentTemplate(staticInstance);
            this.__getHtml();
            this.__registerTemplateAction();
            staticInstance.__template.generateTemplate();
            staticInstance.__styleSheets = this.__renderStyles();
        }
        this.__templateInstance = staticInstance.__template.createInstance(this);
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.adoptedStyleSheets = [...Object.values(staticInstance.__styleSheets), Style.noAnimation];
        shadowRoot.appendChild(this.__templateInstance.content);
        customElements.upgrade(shadowRoot);
        return shadowRoot;
    }
    __registerTemplateAction() {
    }
    connectedCallback() {
        if (this._first) {
            WebComponentInstance.addInstance(this);
            this._first = false;
            this.__defaultValues();
            this.__upgradeAttributes();
            this.__templateInstance?.render();
            this.__removeNoAnimations();
        }
    }
    __removeNoAnimations() {
        if (document.readyState !== "loading") {
            this.offsetWidth;
            setTimeout(() => {
                this.postCreation();
                this._isReady = true;
                this.dispatchEvent(new CustomEvent('postCreationDone'));
                this.shadowRoot.adoptedStyleSheets = Object.values(this.__getStatic().__styleSheets);
                document.removeEventListener("DOMContentLoaded", this.__removeNoAnimations);
            }, 50);
        }
    }
    __defaultValues() { }
    __upgradeAttributes() { }
    __listBoolProps() {
        return [];
    }
    __upgradeProperty(prop) {
        let boolProps = this.__listBoolProps();
        if (boolProps.indexOf(prop) != -1) {
            if (this.hasAttribute(prop) && (this.getAttribute(prop) === "true" || this.getAttribute(prop) === "")) {
                let value = this.getAttribute(prop);
                delete this[prop];
                this[prop] = value;
            }
            else {
                this.removeAttribute(prop);
                this[prop] = false;
            }
        }
        else {
            if (this.hasAttribute(prop)) {
                let value = this.getAttribute(prop);
                delete this[prop];
                this[prop] = value;
            }
        }
    }
    __getStateManager(managerClass) {
        let mClass;
        if (managerClass instanceof StateManager) {
            mClass = managerClass;
        }
        else {
            mClass = Instance.get(managerClass);
        }
        return mClass;
    }
    __addActiveDefState(managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        if (!this.__defaultActiveState.has(mClass)) {
            this.__defaultActiveState.set(mClass, []);
        }
        this.__defaultActiveState.get(mClass)?.push(cb);
    }
    __addInactiveDefState(managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        if (!this.__defaultInactiveState.has(mClass)) {
            this.__defaultInactiveState.set(mClass, []);
        }
        this.__defaultInactiveState.get(mClass)?.push(cb);
    }
    __addActiveState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.active.push(cb);
    }
    __addInactiveState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.inactive.push(cb);
    }
    __addAskChangeState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.askChange.push(cb);
    }
    __createStates() { }
    __createStatesList(statePattern, managerClass) {
        if (!this.__statesList[statePattern]) {
            this.__statesList[statePattern] = new Map();
        }
        let mClass = this.__getStateManager(managerClass);
        if (!this.__statesList[statePattern].has(mClass)) {
            this.__statesList[statePattern].set(mClass, {
                active: [],
                inactive: [],
                askChange: []
            });
        }
    }
    __inactiveDefaultState(managerClass) {
        if (this.__isDefaultState) {
            this.__isDefaultState = false;
            let mClass = this.__getStateManager(managerClass);
            if (this.__defaultInactiveState.has(mClass)) {
                let fcts = this.__defaultInactiveState.get(mClass) ?? [];
                for (let fct of fcts) {
                    fct.bind(this)();
                }
            }
        }
    }
    __activeDefaultState(nextStep, managerClass) {
        if (!this.__isDefaultState) {
            for (let pattern in this.__statesList) {
                if (StateManager.canBeActivate(pattern, nextStep)) {
                    let mClass = this.__getStateManager(managerClass);
                    if (this.__statesList[pattern].has(mClass)) {
                        return;
                    }
                }
            }
            this.__isDefaultState = true;
            let mClass = this.__getStateManager(managerClass);
            if (this.__defaultActiveState.has(mClass)) {
                let fcts = this.__defaultActiveState.get(mClass) ?? [];
                for (let fct of fcts) {
                    fct.bind(this)();
                }
            }
        }
    }
    __subscribeState() {
        if (!this.isReady && this.__stateCleared) {
            return;
        }
        for (let route in this.__statesList) {
            for (const managerClass of this.__statesList[route].keys()) {
                let el = this.__statesList[route].get(managerClass);
                if (el) {
                    managerClass.subscribe(route, el);
                }
            }
        }
    }
    __stateCleared = false;
    __unsubscribeState() {
        for (let route in this.__statesList) {
            for (const managerClass of this.__statesList[route].keys()) {
                let el = this.__statesList[route].get(managerClass);
                if (el) {
                    managerClass.unsubscribe(route, el);
                }
            }
        }
        this.__stateCleared = true;
    }
    dateToString(d) {
        if (d instanceof Date) {
            return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        }
        return null;
    }
    dateTimeToString(dt) {
        if (dt instanceof Date) {
            return new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
        }
        return null;
    }
    stringToDate(s) {
        let td = new Date(s);
        let d = new Date(td.getTime() + (td.getTimezoneOffset() * 60000));
        if (isNaN(d)) {
            return null;
        }
        return d;
    }
    stringToDateTime(s) {
        let td = new Date(s);
        let d = new Date(td.getTime() + (td.getTimezoneOffset() * 60000));
        if (isNaN(d)) {
            return null;
        }
        return d;
    }
    getBoolean(val) {
        if (val === true || val === 1 || val === 'true' || val === '') {
            return true;
        }
        else if (val === false || val === 0 || val === 'false' || val === null || val === undefined) {
            return false;
        }
        console.error("error parsing boolean value " + val);
        return false;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue || !this.isReady) {
            if (this.__onChangeFct.hasOwnProperty(name)) {
                for (let fct of this.__onChangeFct[name]) {
                    fct('');
                }
            }
        }
    }
    remove() {
        super.remove();
        this.postDestruction();
    }
    /**
     * Function triggered when the component is removed from the DOM
     */
    postDestruction() { }
    /**
     * Function triggered the first time the component is rendering inside DOM
     */
    postCreation() { }
    /**
     * Find a parent by tagname if exist
     */
    findParentByTag(tagname, untilNode) {
        return ElementExtension.findParentByTag(this, tagname, untilNode);
    }
    /**
     * Find a parent by class name if exist
     */
    findParentByClass(classname, untilNode) {
        return ElementExtension.findParentByClass(this, classname, untilNode);
    }
    /**
     * Find a parent by type if exist
     */
    findParentByType(type, untilNode) {
        return ElementExtension.findParentByType(this, type, untilNode);
    }
    /**
     * Find list of parents by tagname
     */
    findParents(tagname, untilNode) {
        return ElementExtension.findParents(this, tagname, untilNode);
    }
    /**
     * Check if element contains a child
     */
    containsChild(el) {
        return ElementExtension.containsChild(this, el);
    }
    /**
     * Get element inside slot
     */
    getElementsInSlot(slotName) {
        return ElementExtension.getElementsInSlot(this, slotName);
    }
}
WebComponent.Namespace=`${moduleName}`;
_.WebComponent=WebComponent;
const WebComponentInstance=class WebComponentInstance {
    static __allDefinitions = [];
    static __allInstances = [];
    /**
     * Last definition insert datetime
     */
    static lastDefinition = 0;
    static registerDefinition(def) {
        WebComponentInstance.lastDefinition = Date.now();
        WebComponentInstance.__allDefinitions.push(def);
    }
    static removeDefinition(def) {
        WebComponentInstance.lastDefinition = Date.now();
        let index = WebComponentInstance.__allDefinitions.indexOf(def);
        if (index > -1) {
            WebComponentInstance.__allDefinitions.splice(index, 1);
        }
    }
    /**
     * Get all sub classes of type
     */
    static getAllClassesOf(type) {
        let result = [];
        for (let def of WebComponentInstance.__allDefinitions) {
            if (def.prototype instanceof type) {
                result.push(def);
            }
        }
        return result;
    }
    /**
     * Get all registered definitions
     */
    static getAllDefinitions() {
        return WebComponentInstance.__allDefinitions;
    }
    static addInstance(instance) {
        this.__allInstances.push(instance);
    }
    static removeInstance(instance) {
        let index = this.__allInstances.indexOf(instance);
        if (index > -1) {
            this.__allInstances.splice(index, 1);
        }
    }
    static getAllInstances(type) {
        let result = [];
        for (let instance of this.__allInstances) {
            if (instance instanceof type) {
                result.push(instance);
            }
        }
        return result;
    }
    static create(type) {
        let _class = customElements.get(type);
        if (_class) {
            return new _class();
        }
        let splitted = type.split(".");
        let current = window;
        for (let part of splitted) {
            current = current[part];
        }
        if (current && current.prototype instanceof Aventus.WebComponent) {
            return new current();
        }
        return null;
    }
}
WebComponentInstance.Namespace=`${moduleName}`;
_.WebComponentInstance=WebComponentInstance;

for(let key in _) { Aventus[key] = _[key] }
})(Aventus);

var frontend;
(frontend||(frontend = {}));
(function (frontend) {
const moduleName = `frontend`;
const _ = {};


let _n;
const Error=class Error {
}
Error.Namespace=`${moduleName}`;
_.Error=Error;
const Users=class Users extends Aventus.State {
    static stateName = "users";
    /**
     * @inheritdoc
     */
    get name() {
        return Users.stateName;
    }
}
Users.Namespace=`${moduleName}`;
_.Users=Users;
const UserEdit=class UserEdit extends Aventus.State {
    static stateName = "user/edit";
    userId;
    /**
     * @inheritdoc
     */
    get name() {
        return UserEdit.stateName;
    }
    constructor(userId) {
        super();
        this.userId = userId;
    }
}
UserEdit.Namespace=`${moduleName}`;
_.UserEdit=UserEdit;
const Login=class Login extends Aventus.State {
    static stateName = "login";
    username;
    password;
    onActivate() {
        if (this.username === undefined || this.username === "") {
            return;
        }
        if (this.password === undefined || this.password === "") {
            return;
        }
    }
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }
    /**
     * @inheritdoc
     */
    get name() {
        return Login.stateName;
    }
}
Login.Namespace=`${moduleName}`;
_.Login=Login;
const Footer = class Footer extends Aventus.WebComponent {
    static __style = `:host{display:block}:host .footer{height:75px;width:100%;display:flex;align-items:center;justify-content:center}`;
    __getStatic() {
        return Footer;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Footer.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="footer">
    <div class="copyrights">Copyright © 2024 HES-SO ISC</div>
</div>` }
    });
}
    getClassName() {
        return "Footer";
    }
}
Footer.Namespace=`${moduleName}`;
Footer.Tag=`av-footer`;
_.Footer=Footer;
if(!window.customElements.get('av-footer')){window.customElements.define('av-footer', Footer);Aventus.WebComponentInstance.registerDefinition(Footer);}

const Toggle = class Toggle extends Aventus.WebComponent {
    static get observedAttributes() {return ["value"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'value'() {
                return this.hasAttribute('value');
            }
            set 'value'(val) {
                val = this.getBoolean(val);
                if (val) {
                    this.setAttribute('value', 'true');
                } else{
                    this.removeAttribute('value');
                }
            }
    static __style = `:host{user-select:none;cursor:pointer;padding:5px}:host:host([value=true]) div{background-color:var(--bs-green)}:host:host(:not([value=true])) div{background-color:var(--bs-red)}:host div{transition:background-color .3s;width:25px;height:25px;border-radius:50%}`;
    __getStatic() {
        return Toggle;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Toggle.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div></div>` }
    });
}
    getClassName() {
        return "Toggle";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('value')) { this.attributeChangedCallback('value', false, false); }
 }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('value');
 }
    __listBoolProps() { return ["value"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    toggleValue() {
        this.value = !this.value;
    }
    postCreation() {
        // Need to add the event here as we're adding it to the element itself, not a children
        this.addEventListener("click", () => {
            this.toggleValue();
        });
    }
}
Toggle.Namespace=`${moduleName}`;
Toggle.Tag=`av-toggle`;
_.Toggle=Toggle;
if(!window.customElements.get('av-toggle')){window.customElements.define('av-toggle', Toggle);Aventus.WebComponentInstance.registerDefinition(Toggle);}

const Dashboard=class Dashboard extends Aventus.State {
    /**
     * @inheritdoc
     */
    get name() {
        return "dashboard";
    }
}
Dashboard.Namespace=`${moduleName}`;
_.Dashboard=Dashboard;
const DataFetcher=class DataFetcher {
    static postAction(url, data) {
        console.log("[INFO] POST on ", url, " with ", data);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(async (res) => {
                const body = await res.json();
                if (body.success) {
                    console.log("[INFO] POST success, data : ", body);
                    resolve(body);
                }
                else {
                    console.log("[ERROR] POST on ", url, " failed with reason : ", body.reason);
                    reject(body);
                }
            });
        });
    }
}
DataFetcher.Namespace=`${moduleName}`;
_.DataFetcher=DataFetcher;
const LoggedManager=class LoggedManager {
    static loaded = false;
    static loading = false;
    static admin = false;
    static logged = false;
    static async getLogged() {
        if (!LoggedManager.loaded) {
            if (LoggedManager.loading) {
                return new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        const res = await LoggedManager.getLogged();
                        resolve(res);
                    }, 100);
                });
            }
            else {
                LoggedManager.loading = true;
                await LoggedManager.loadAdmin();
                LoggedManager.loading = false;
            }
        }
        return new Promise((resolve, reject) => {
            resolve(LoggedManager.logged);
        });
    }
    static async getAdmin() {
        if (!LoggedManager.loaded) {
            if (LoggedManager.loading) {
                return new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        const res = await LoggedManager.getAdmin();
                        resolve(res);
                    }, 100);
                });
            }
            else {
                LoggedManager.loading = true;
                await LoggedManager.loadAdmin;
                LoggedManager.loading = false;
            }
        }
        return new Promise((resolve, reject) => {
            resolve(LoggedManager.admin);
        });
    }
    static loadAdmin() {
        return new Promise(async (resolve, reject) => {
            const res = await DataFetcher.postAction("amiloggedin", {});
            if (!res.success) {
                reject();
                return;
            }
            LoggedManager.admin = res.data.admin;
            LoggedManager.logged = res.data.logged;
            LoggedManager.loaded = true;
            resolve(true);
        });
    }
}
LoggedManager.Namespace=`${moduleName}`;
_.LoggedManager=LoggedManager;
const DoorEdit=class DoorEdit extends Aventus.State {
    doorId;
    static stateName = "door/edit";
    constructor(doorId) {
        super();
        this.doorId = doorId;
    }
    /**
     * @inheritdoc
     */
    get name() {
        return DoorEdit.stateName;
    }
}
DoorEdit.Namespace=`${moduleName}`;
_.DoorEdit=DoorEdit;
const MainStateManager=class MainStateManager extends Aventus.StateManager {
    /**
     * Get the instance of the StateManager
     */
    static getInstance() {
        return Aventus.Instance.get(MainStateManager);
    }
}
MainStateManager.Namespace=`${moduleName}`;
_.MainStateManager=MainStateManager;
const Header = class Header extends Aventus.WebComponent {
    static __style = `:host{display:block}:host .header{height:75px;width:100%;background-color:var(--bs-primary);color:var(--bs-white);font-weight:bolder;display:none;gap:50px;padding-left:50px;justify-content:space-between;padding:0 30px}:host .header.active{display:flex}:host .header.login{align-items:center;justify-content:center}:host .header .left{display:flex;gap:75px}:host .header .left .title{cursor:pointer;height:100%;font-size:24px;display:flex;align-items:center;justify-content:center}:host .header .actions{user-select:none;font-weight:normal;gap:25px;display:flex;align-items:center;justify-content:space-between;height:100%}:host .header .actions.right{align-self:flex-end}:host .header .actions.left{align-self:flex-start}:host .header .actions *{border-radius:15px;padding:5px 10px;cursor:pointer;transition:color .35s,background-color .25s}:host .header .actions *:hover{background-color:rgba(255,255,255,.1)}:host .header .actions *.active{background-color:var(--bs-white);color:var(--bs-black)}`;
    __getStatic() {
        return Header;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Header.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="header active" _id="header_0">
    <div class="left">
        <div class="title" data-state="dashboard" _id="header_1">Doors Manager</div>
        <div class="actions" _id="header_2">
            <a class="dashboard" data-state="dashboard" _id="header_3">Dashboard</a>
            <a class="users" data-state="users" _id="header_4">Users</a>
        </div>
    </div>
    <div class="right">
        <div class="actions">
            <a class="logout" data-state="logout" _id="header_5">Logout</a>
        </div>
    </div>
</div><div class="header login" _id="header_6">
    <div class="left">
        <div class="title">
            Doors Manager Login
        </div>
    </div>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList("^dashboard|users|doors$", MainStateManager);this.__addActiveState("^dashboard|users|doors$", MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.stateChanged(state, slugs);})
this.__addInactiveState("^dashboard|users|doors$", MainStateManager, (state, nextState, slugs) => { that.stateChanged(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
this.__createStatesList("login", MainStateManager);this.__addActiveState("login", MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.loginActive(state, slugs);})
this.__addInactiveState("login", MainStateManager, (state, nextState, slugs) => { that.loginInactive(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "header",
      "ids": [
        "header_0"
      ]
    },
    {
      "name": "actions",
      "ids": [
        "header_2"
      ]
    },
    {
      "name": "userLink",
      "ids": [
        "header_4"
      ]
    },
    {
      "name": "loginHeader",
      "ids": [
        "header_6"
      ]
    }
  ],
  "events": [
    {
      "eventName": "click",
      "id": "header_1",
      "fct": (e, c) => c.component.activateState(e)
    },
    {
      "eventName": "click",
      "id": "header_3",
      "fct": (e, c) => c.component.activateState(e)
    },
    {
      "eventName": "click",
      "id": "header_4",
      "fct": (e, c) => c.component.activateState(e)
    },
    {
      "eventName": "click",
      "id": "header_5",
      "fct": (e, c) => c.component.activateState(e)
    }
  ]
});
 }
    getClassName() {
        return "Header";
    }
    stateChanged() {
        const stateName = MainStateManager.getInstance().getState()?.name;
        const children = this.actions.children;
        for (let i = 0; i < children.length; i++) {
            const curr = children[i];
            if (curr.getAttribute("data-state") === stateName) {
                curr.classList.add("active");
            }
            else {
                curr.classList.remove("active");
            }
        }
    }
    loginActive() {
        this.header.classList.remove("active");
        this.loginHeader.classList.add("active");
    }
    async loginInactive() {
        this.header.classList.add("active");
        this.loginHeader.classList.remove("active");
        if (await LoggedManager.getAdmin()) {
            this.userLink.style.display = "block";
        }
        else {
            this.userLink.style.display = "none";
        }
    }
    async activateState(e) {
        if (e.target && e.target.dataset && e.target.dataset["state"]) {
            if (e.target.dataset["state"] === "logout") {
                const res = await DataFetcher.postAction("logout", {});
                if (res.success) {
                    MainStateManager.getInstance().setState("login");
                }
            }
            else {
                MainStateManager.getInstance().setState(e.target.dataset["state"]);
            }
        }
        else {
            console.log("Got a click on link but didn't found any data-state property to fallback to...");
        }
    }
}
Header.Namespace=`${moduleName}`;
Header.Tag=`av-header`;
_.Header=Header;
if(!window.customElements.get('av-header')){window.customElements.define('av-header', Header);Aventus.WebComponentInstance.registerDefinition(Header);}

const Page = class Page extends Aventus.WebComponent {
    static __style = `:host{width:100%;height:100%}:host:host(:not([visible])){display:none}`;
    constructor() { super(); if (this.constructor == Page) { throw "can't instanciate an abstract class"; } }
    __getStatic() {
        return Page;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Page.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`` }
    });
}
    getClassName() {
        return "Page";
    }
    showPage() {
        this.setAttribute("visible", "true");
    }
    hidePage() {
        this.removeAttribute("visible");
    }
}
Page.Namespace=`${moduleName}`;
_.Page=Page;

const DashboardPage = class DashboardPage extends Page {
    static __style = `:host .content{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:25px}:host .content .header{font-size:24px}:host .content .list{border:1px solid #d3d3d3;border-radius:5px;padding:10px 25px;max-width:1000px;width:100%}:host .content .list:not([editable]) .door .edit{display:none}:host .content .list .door{width:100%;height:50px;display:flex;gap:10px;align-items:center;justify-content:space-between}:host .content .list .door .name,:host .content .list .door .edit{width:45%;height:25px}:host .content .list .door .edit{width:45%;display:flex;justify-content:flex-end;cursor:pointer}:host .content .list .door .edit *{background-color:var(--bs-blue);color:var(--bs-white);user-select:none;display:flex;align-items:center;justify-content:center;width:60px;border-radius:15px}:host .content .list .door .status{user-select:none;border-radius:50%;height:25px;width:25px;background-color:red;cursor:pointer}:host .content .list .door .status[open=true]{background-color:green}:host .content .addDoor{display:flex;align-items:center;justify-content:center;background-color:var(--bs-success);color:var(--bs-white);padding:5px 10px;border-radius:10px;user-select:none;cursor:pointer}`;
    __getStatic() {
        return DashboardPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(DashboardPage.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="content" _id="dashboardpage_0">
    <div class="header">
        Doors
    </div>
    <div class="list" editable="true" _id="dashboardpage_1">
        <div class="door" _id="dashboardpage_2">
            <div class="name">
                <div class="text">Door1</div>
            </div>
            <div class="status" open="true"></div>
            <div class="edit">
                <div class="text">Edit</div>
            </div>
        </div>
    </div>
    <a class="addDoor" _id="dashboardpage_3">addDoor</a>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList(Dashboard.name, MainStateManager);this.__addActiveState(Dashboard.name, MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.activate(state, slugs);})
this.__addInactiveState(Dashboard.name, MainStateManager, (state, nextState, slugs) => { that.deactivate(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "content",
      "ids": [
        "dashboardpage_0"
      ]
    },
    {
      "name": "doorsList",
      "ids": [
        "dashboardpage_1"
      ]
    },
    {
      "name": "doorModel",
      "ids": [
        "dashboardpage_2"
      ]
    },
    {
      "name": "addDoorButton",
      "ids": [
        "dashboardpage_3"
      ]
    }
  ],
  "events": [
    {
      "eventName": "click",
      "id": "dashboardpage_3",
      "fct": (e, c) => c.component.addDoor(e)
    }
  ]
});
 }
    getClassName() {
        return "DashboardPage";
    }
    addDoor() {
        MainStateManager.getInstance().setState(new DoorEdit(-1));
    }
    async getData() {
        return await DataFetcher.postAction("/doors/", {});
    }
    async activate() {
        this.showPage();
        const response = await this.getData();
        if (!await LoggedManager.getAdmin()) {
            this.addDoorButton.remove();
        }
        else {
            this.content.appendChild(this.addDoorButton);
        }
        this.fillList(response.data);
    }
    deactivate() {
        this.hidePage();
    }
    async fillList(data) {
        this.doorsList.innerText = "";
        const isAdmin = await LoggedManager.getAdmin();
        for (let el of data) {
            const door = this.doorModel.cloneNode(true);
            door.children[0].children[0].innerText = el.name;
            door.children[1].toggleAttribute("open", !el.closed);
            door.children[1].addEventListener("click", async () => {
                const res = await DataFetcher.postAction("/door/toggle/", {
                    id: el.id,
                    closed: door.children[1].hasAttribute("open")
                });
                if (res.success) {
                    if (!door.children[1].hasAttribute("open")) {
                        door.children[1].setAttribute("open", "true");
                    }
                    else {
                        door.children[1].removeAttribute("open");
                    }
                }
            });
            if (isAdmin) {
                door.children[2].addEventListener("click", () => {
                    MainStateManager.getInstance().setState(new DoorEdit(el.id));
                });
            }
            else {
                door.children[2].remove();
            }
            this.doorsList.appendChild(door);
        }
    }
    postCreation() {
        this.doorModel.remove();
    }
}
DashboardPage.Namespace=`${moduleName}`;
DashboardPage.Tag=`av-dashboard-page`;
_.DashboardPage=DashboardPage;
if(!window.customElements.get('av-dashboard-page')){window.customElements.define('av-dashboard-page', DashboardPage);Aventus.WebComponentInstance.registerDefinition(DashboardPage);}

const DoorFormPage = class DoorFormPage extends Page {
    personExample;
    data;
    static __style = `:host .label{font-size:18px;height:30px}:host .form{width:100%;height:100%}:host .form>.doorName{height:40px;font-size:24px;font-weight:bold}:host .form .fields{width:100%;height:calc(100% - 40px);padding:40px;display:flex;flex-direction:column;gap:25px}:host .form .fields .field.doorName{display:flex;flex-direction:column;gap:10px;max-width:400px}:host .form .fields .field.doorName input{border:1px solid #d3d3d3;border-radius:5px;padding:10px 10px;font-size:14px;outline:none}:host .form .fields .field.personListWrap{height:calc(100% - 100px)}:host .form .fields .field.personListWrap .personList{height:calc(100% - 30px);overflow-y:auto;border:1px solid #000;border-radius:5px;display:flex;flex-direction:column;gap:10px}:host .form .fields .field.personListWrap .personList .person{transition:background-color .3s;display:flex;align-items:center;justify-content:space-between;margin:5px 5px;border-radius:5px;padding:0 25px}:host .form .fields .field.personListWrap .personList .person:hover{background-color:rgba(0,0,0,.2)}:host .form .fields .field.personListWrap .personList .person .hasAccess{display:flex;align-items:center;justify-content:center}:host .form .fields .field.actions{height:75px;display:flex;justify-content:space-between;align-items:center}:host .form .fields .field.actions *{cursor:pointer;width:130px;height:35px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:var(--bs-white)}:host .form .fields .field.actions *.submit{background-color:var(--bs-success)}:host .form .fields .field.actions *.cancel{background-color:var(--bs-secondary)}:host .form .fields .field.actions *.delete{background-color:var(--bs-danger)}`;
    __getStatic() {
        return DoorFormPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(DoorFormPage.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="form">
    <div class="doorName" _id="doorformpage_0">aha</div>
    <div class="fields">
        <div class="field doorName">
            <div class="label">Door name</div>
            <input type="text" _id="doorformpage_1" />
        </div>
        <div class="field personListWrap">
            <div class="label">Persons access</div>
            <div class="personList" _id="doorformpage_2">
                <div class="person">
                    <div class="username">Ceci est un username</div>
                    <div class="hasAccess">
                        <av-toggle value="true"></av-toggle>
                    </div>
                </div>
            </div>
        </div>
        <div class="field actions">
            <div class="cancel" _id="doorformpage_3">Cancel</div>
            <div class="delete" _id="doorformpage_4">Delete</div>
            <div class="submit" _id="doorformpage_5">Submit</div>
        </div>
    </div>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList(DoorEdit.stateName, MainStateManager);this.__addActiveState(DoorEdit.stateName, MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.activate(state, slugs);})
this.__addInactiveState(DoorEdit.stateName, MainStateManager, (state, nextState, slugs) => { that.deactivate(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "doorName",
      "ids": [
        "doorformpage_0"
      ]
    },
    {
      "name": "doorNameInput",
      "ids": [
        "doorformpage_1"
      ]
    },
    {
      "name": "personList",
      "ids": [
        "doorformpage_2"
      ]
    }
  ],
  "events": [
    {
      "eventName": "input",
      "id": "doorformpage_1",
      "fct": (e, c) => c.component.doorNameChanged(e)
    },
    {
      "eventName": "click",
      "id": "doorformpage_3",
      "fct": (e, c) => c.component.cancelEdit(e)
    },
    {
      "eventName": "click",
      "id": "doorformpage_4",
      "fct": (e, c) => c.component.delete(e)
    },
    {
      "eventName": "click",
      "id": "doorformpage_5",
      "fct": (e, c) => c.component.submitEdit(e)
    }
  ]
});
 }
    getClassName() {
        return "DoorFormPage";
    }
    async delete() {
        if (this.data.id != -1) {
            const res = await DataFetcher.postAction("/door/delete/", { id: this.data.id });
            if (res.success) {
                MainStateManager.getInstance().setState("dashboard");
            }
            else {
                console.log("An error occured during deletion");
            }
        }
        else {
            MainStateManager.getInstance().setState("dashboard");
        }
    }
    doorNameChanged() {
        this.doorName.innerText = this.doorNameInput.value;
    }
    async activate() {
        const id = MainStateManager.getInstance().getState().doorId;
        if (id !== -1) {
            this.data = (await DataFetcher.postAction("/door/get/", { id })).data;
        }
        else {
            let users = (await DataFetcher.postAction("/users/", {})).data;
            for (let i = 0; i < users.length; i++) {
                users[i] = {
                    user: users[i],
                    hasAccess: false
                };
            }
            this.data = {
                id: -1,
                name: "Default",
                users
            };
        }
        this.fillData();
        this.showPage();
    }
    deactivate() {
        this.hidePage();
    }
    fillData() {
        this.doorNameInput.value = this.data["name"];
        this.doorNameChanged();
        this.fillPersonList(this.data.users);
        // TODO: Need to call fillPersonList with person data for this door
    }
    fillPersonList(data) {
        this.personList.innerText = "";
        for (const e of data) {
            const p = e.user;
            const newP = this.personExample.cloneNode(true);
            newP.dataset.id = p.id;
            newP.children[0].innerText = p["username"];
            newP.children[1].children[0].value = e["hasAccess"];
            this.personList.appendChild(newP);
        }
    }
    async submitEdit() {
        this.data.name = this.doorNameInput.value;
        const children = this.personList.children;
        this.data.User_Door = [];
        for (let i = 0; i < children.length; i++) {
            const el = children[i];
            const id = el.dataset.id;
            if (el.children[1].children[0].value) {
                this.data.User_Door.push({
                    uid: parseInt(id)
                });
            }
        }
        delete this.data.users;
        if (this.data.id != -1) {
            await DataFetcher.postAction("/door/edit/", this.data);
        }
        else {
            delete this.data.id;
            const res = await DataFetcher.postAction("/door/create/", this.data);
            if (!res.success) {
                console.log("An error has occured during creation");
            }
        }
        MainStateManager.getInstance().setState("dashboard");
    }
    postCreation() {
        this.personExample = this.personList.children[0];
    }
    cancelEdit() {
        MainStateManager.getInstance().setState("dashboard");
    }
}
DoorFormPage.Namespace=`${moduleName}`;
DoorFormPage.Tag=`av-door-form-page`;
_.DoorFormPage=DoorFormPage;
if(!window.customElements.get('av-door-form-page')){window.customElements.define('av-door-form-page', DoorFormPage);Aventus.WebComponentInstance.registerDefinition(DoorFormPage);}

const LoginPage = class LoginPage extends Page {
    callback;
    static __style = `:host{width:100%;height:100%;display:flex;text-align:center;justify-content:center}:host div.form{display:flex;align-items:center;flex-direction:column;justify-content:center;gap:35px}:host div.form *{width:300px;display:flex;flex-direction:column;gap:10px}:host div.form *.submit{background-color:var(--bs-primary);color:var(--bs-white);border-radius:10px;padding:5px;font-weight:bold;letter-spacing:1px;cursor:pointer}:host div.form * .label{user-select:none;text-align:left}:host div.form * input{border-radius:5px;border:1px solid #d3d3d3;padding:10px 10px;outline:none;box-shadow:none}`;
    __getStatic() {
        return LoginPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(LoginPage.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="form">
    <div class="username">
        <div class="label">Username</div>
        <input type="text" placeholder="Username" _id="loginpage_0" />
    </div>
    <div class="password">
        <div class="label">Password</div>
        <input type="password" placeholder="Password" _id="loginpage_1" />
    </div>
    <div class="submit">Login</div>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList(Login.name, MainStateManager);this.__addActiveState(Login.name, MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.activate(state, slugs);})
this.__addInactiveState(Login.name, MainStateManager, (state, nextState, slugs) => { that.deactivate(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "username",
      "ids": [
        "loginpage_0"
      ]
    },
    {
      "name": "password",
      "ids": [
        "loginpage_1"
      ]
    }
  ]
});
 }
    getClassName() {
        return "LoginPage";
    }
    submitForm() {
        console.log("Submit form with : ", this.password.value, " and ", this.username.value);
        DataFetcher.postAction("/login/", { username: this.username.value, password: window.hasher(this.password.value) }).then(async (res) => {
            if (res.success) {
                await LoggedManager.loadAdmin();
                MainStateManager.getInstance().setState("dashboard");
            }
        });
    }
    keyDownEvent(e) {
        if (e.key === "Enter") {
            this.submitForm();
        }
    }
    activate() {
        const that = this;
        this.callback = (e) => {
            that.keyDownEvent(e);
        };
        this.showPage();
        document.addEventListener("keydown", this.callback);
    }
    deactivate() {
        this.hidePage();
        this.username.value = "";
        this.password.value = "";
        if (this.callback) {
            document.removeEventListener("keydown", this.callback);
        }
    }
}
LoginPage.Namespace=`${moduleName}`;
LoginPage.Tag=`av-login-page`;
_.LoginPage=LoginPage;
if(!window.customElements.get('av-login-page')){window.customElements.define('av-login-page', LoginPage);Aventus.WebComponentInstance.registerDefinition(LoginPage);}

const PageContainer = class PageContainer extends Aventus.WebComponent {
    static __style = `:host{display:block;width:100%;height:100%}:host .content{padding:10px 25px;width:100%;height:calc(100% - 150px)}`;
    __getStatic() {
        return PageContainer;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PageContainer.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<av-header></av-header><div class="content" _id="pagecontainer_0">
<av-login-page></av-login-page>
<av-dashboard-page></av-dashboard-page>
<av-door-form-page></av-door-form-page>
<av-users-page></av-users-page>
<av-user-form></av-user-form>
</div><av-footer></av-footer>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "content",
      "ids": [
        "pagecontainer_0"
      ]
    }
  ]
});
 }
    getClassName() {
        return "PageContainer";
    }
    async postCreation() {
        // Checking if user is logged in
        const res = await LoggedManager.getLogged();
        if (res) {
            MainStateManager.getInstance().setState("dashboard");
        }
        else {
            MainStateManager.getInstance().setState("login");
        }
    }
}
PageContainer.Namespace=`${moduleName}`;
PageContainer.Tag=`av-page-container`;
_.PageContainer=PageContainer;
if(!window.customElements.get('av-page-container')){window.customElements.define('av-page-container', PageContainer);Aventus.WebComponentInstance.registerDefinition(PageContainer);}

const UserForm = class UserForm extends Page {
    doorExample;
    data;
    static __style = `:host .label{font-size:18px;height:30px}:host .form{width:100%;height:100%}:host .form>.userName{height:40px;font-size:24px;font-weight:bold}:host .form .fields{width:100%;height:calc(100% - 40px);padding:40px;display:flex;flex-direction:column;gap:25px}:host .form .fields .field.username,:host .form .fields .field.password{display:flex;flex-direction:column;gap:10px;max-width:400px}:host .form .fields .field.username input,:host .form .fields .field.password input{border:1px solid #d3d3d3;border-radius:5px;padding:10px 10px;font-size:14px;outline:none}:host .form .fields .field.doorListWrap{height:calc(100% - 100px)}:host .form .fields .field.doorListWrap .doorList{max-height:325px;height:calc(100% - 30px);overflow-y:auto;border:1px solid #000;border-radius:5px;display:flex;flex-direction:column;gap:10px}:host .form .fields .field.doorListWrap .doorList .door{transition:background-color .3s;display:flex;align-items:center;justify-content:space-between;margin:5px 5px;border-radius:5px;padding:0 25px}:host .form .fields .field.doorListWrap .doorList .door:hover{background-color:rgba(0,0,0,.2)}:host .form .fields .field.doorListWrap .doorList .door .hasAccess{display:flex;align-items:center;justify-content:center}:host .form .fields .field.actions{height:75px;display:flex;justify-content:space-between;align-items:center}:host .form .fields .field.actions *{cursor:pointer;width:130px;height:35px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:var(--bs-white)}:host .form .fields .field.actions *.submit{background-color:var(--bs-success)}:host .form .fields .field.actions *.cancel{background-color:var(--bs-secondary)}:host .form .fields .field.actions *.delete{background-color:var(--bs-danger)}`;
    __getStatic() {
        return UserForm;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(UserForm.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="form">
    <div class="userName" _id="userform_0">aha</div>
    <div class="fields">
        <div class="field username">
            <div class="label">Username</div>
            <input type="text" _id="userform_1" />
        </div>
        <div class="field password">
            <div class="label">Password</div>
            <input type="password" _id="userform_2" />
        </div>
        <div class="field admin">
            <div class="label">Admin ?</div>
            <av-toggle _id="userform_3"></av-toggle>
        </div>
        <div class="field doorListWrap">
            <div class="label">Door access</div>
            <div class="doorList" _id="userform_4">
                <div class="door">
                    <div class="name">Ceci est un username</div>
                    <div class="hasAccess">
                        <av-toggle value="true"></av-toggle>
                    </div>
                </div>
            </div>
        </div>
        <div class="field actions">
            <div class="cancel" _id="userform_5">Cancel</div>
            <div class="delete" _id="userform_6">Delete</div>
            <div class="submit" _id="userform_7">Submit</div>
        </div>
    </div>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList(UserEdit.stateName, MainStateManager);this.__addActiveState(UserEdit.stateName, MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.activate(state, slugs);})
this.__addInactiveState(UserEdit.stateName, MainStateManager, (state, nextState, slugs) => { that.deactivate(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "userName",
      "ids": [
        "userform_0"
      ]
    },
    {
      "name": "userNameInput",
      "ids": [
        "userform_1"
      ]
    },
    {
      "name": "userPasswordInput",
      "ids": [
        "userform_2"
      ]
    },
    {
      "name": "isAdmin",
      "ids": [
        "userform_3"
      ]
    },
    {
      "name": "doorList",
      "ids": [
        "userform_4"
      ]
    }
  ],
  "events": [
    {
      "eventName": "input",
      "id": "userform_1",
      "fct": (e, c) => c.component.usernameChanged(e)
    },
    {
      "eventName": "click",
      "id": "userform_5",
      "fct": (e, c) => c.component.cancelEdit(e)
    },
    {
      "eventName": "click",
      "id": "userform_6",
      "fct": (e, c) => c.component.delete(e)
    },
    {
      "eventName": "click",
      "id": "userform_7",
      "fct": (e, c) => c.component.submitEdit(e)
    }
  ]
});
 }
    getClassName() {
        return "UserForm";
    }
    async activate() {
        const id = MainStateManager.getInstance().getState().userId;
        if (id !== -1) {
            this.data = (await DataFetcher.postAction("/user/get/", { id })).data;
        }
        else {
            let doors = (await DataFetcher.postAction("/doors/", {})).data;
            for (let i = 0; i < doors.length; i++) {
                doors[i] = {
                    door: doors[i],
                    hasAccess: false
                };
            }
            this.data = {
                id: -1,
                isadmin: false,
                username: "Default",
                password: "",
                doors
            };
        }
        this.fillData();
        this.showPage();
    }
    deactivate() {
        this.hidePage();
    }
    fillData() {
        this.userNameInput.value = this.data["username"];
        this.userPasswordInput.value = "";
        this.isAdmin.value = this.data["isadmin"];
        this.usernameChanged();
        this.fillDoorList(this.data.doors);
        // TODO: Need to call fillPersonList with person data for this door
    }
    fillDoorList(data) {
        this.doorList.innerText = "";
        for (const e of data) {
            const p = e.door;
            const newP = this.doorExample.cloneNode(true);
            newP.dataset.id = p.id;
            newP.children[0].innerText = p["name"];
            newP.children[1].children[0].value = e["hasAccess"];
            this.doorList.appendChild(newP);
        }
    }
    usernameChanged() {
        this.userName.innerText = this.userNameInput.value;
    }
    cancelEdit() {
        MainStateManager.getInstance().setState("dashboard");
    }
    async delete() {
        if (this.data.id != -1) {
            const res = await DataFetcher.postAction("/user/delete/", { id: this.data.id });
            if (res.success) {
                MainStateManager.getInstance().setState("dashboard");
            }
            else {
                console.log("An error occured during deletion");
            }
        }
        MainStateManager.getInstance().setState("dashboard");
    }
    async submitEdit() {
        this.data.username = this.userNameInput.value;
        const children = this.doorList.children;
        this.data.User_Door = [];
        for (let i = 0; i < children.length; i++) {
            const el = children[i];
            const id = el.dataset.id;
            if (el.children[1].children[0].value) {
                this.data.User_Door.push({
                    did: parseInt(id)
                });
            }
        }
        delete this.data.doors;
        this.data.isadmin = this.isAdmin.value;
        if (this.userPasswordInput.value != "") {
            this.data.password = window.hasher(this.userPasswordInput.value);
        }
        else {
            delete this.data.password;
        }
        if (this.data.id != -1) {
            await DataFetcher.postAction("/user/edit/", this.data);
        }
        else {
            delete this.data.id;
            const res = await DataFetcher.postAction("/user/create/", this.data);
            if (!res.success) {
                console.log("An error has occured during creation");
            }
        }
        MainStateManager.getInstance().setState("dashboard");
    }
    postCreation() {
        this.doorExample = this.doorList.children[0];
    }
}
UserForm.Namespace=`${moduleName}`;
UserForm.Tag=`av-user-form`;
_.UserForm=UserForm;
if(!window.customElements.get('av-user-form')){window.customElements.define('av-user-form', UserForm);Aventus.WebComponentInstance.registerDefinition(UserForm);}

const UsersPage = class UsersPage extends Page {
    static __style = `:host .content{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:25px}:host .content .header{font-size:24px}:host .content .list{border:1px solid #d3d3d3;border-radius:5px;padding:10px 25px;max-width:1000px;width:100%}:host .content .list:not([editable]) .door .edit{display:none}:host .content .list .user{width:100%;height:50px;display:flex;gap:10px;align-items:center;justify-content:space-between}:host .content .list .user .name,:host .content .list .user .edit{flex-grow:1;height:25px}:host .content .list .user .edit{display:flex;justify-content:flex-end;cursor:pointer}:host .content .list .user .edit *{user-select:none;display:flex;align-items:center;justify-content:center;width:60px;border-radius:15px;background-color:var(--bs-blue);color:var(--bs-white)}:host .content .addUser{display:flex;align-items:center;justify-content:center;background-color:var(--bs-success);color:var(--bs-white);padding:5px 10px;border-radius:10px;user-select:none;cursor:pointer}`;
    __getStatic() {
        return UsersPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(UsersPage.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="content">
    <div class="header">
        Users
    </div>
    <div class="list" editable="true" _id="userspage_0">
        <div class="user" _id="userspage_1">
            <div class="name">
                <div class="text">User1</div>
            </div>
            <div class="edit">
                <div class="text">Edit</div>
            </div>
        </div>
    </div>
    <a class="addUser" _id="userspage_2">Add user</a>
</div>` }
    });
}
    __createStates() { super.__createStates(); let that = this;  this.__createStatesList(Users.stateName, MainStateManager);this.__addActiveState(Users.stateName, MainStateManager, (state, slugs) => { that.__inactiveDefaultState(MainStateManager); that.activate(state, slugs);})
this.__addInactiveState(Users.stateName, MainStateManager, (state, nextState, slugs) => { that.deactivate(state, nextState, slugs);that.__activeDefaultState(nextState, MainStateManager);})
 }
    __registerTemplateAction() { super.__registerTemplateAction();
this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "userList",
      "ids": [
        "userspage_0"
      ]
    },
    {
      "name": "userModel",
      "ids": [
        "userspage_1"
      ]
    }
  ],
  "events": [
    {
      "eventName": "click",
      "id": "userspage_2",
      "fct": (e, c) => c.component.addUser(e)
    }
  ]
});
 }
    getClassName() {
        return "UsersPage";
    }
    addUser() {
        MainStateManager.getInstance().setState(new UserEdit(-1));
    }
    async activate() {
        this.showPage();
        const data = await this.getData();
        this.fillList(data);
    }
    deactivate() {
        this.hidePage();
    }
    async getData() {
        const res = await DataFetcher.postAction("users", {});
        if (res.success) {
            return res.data;
        }
        return [];
    }
    fillList(data) {
        this.userList.innerText = "";
        for (const p of data) {
            const pers = this.userModel.cloneNode(true);
            pers.children[0].children[0].innerHTML = p.username;
            pers.children[1].addEventListener("click", () => {
                MainStateManager.getInstance().setState(new UserEdit(p.id));
            });
            this.userList.appendChild(pers);
        }
    }
    postCreation() {
        this.userModel.remove();
    }
}
UsersPage.Namespace=`${moduleName}`;
UsersPage.Tag=`av-users-page`;
_.UsersPage=UsersPage;
if(!window.customElements.get('av-users-page')){window.customElements.define('av-users-page', UsersPage);Aventus.WebComponentInstance.registerDefinition(UsersPage);}


for(let key in _) { frontend[key] = _[key] }
})(frontend);
