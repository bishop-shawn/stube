package com.stube.app.webview.events

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * Event emitted when there is an error in loading.
 */
class TopLoadingErrorEvent(viewId: Int, private val mEventData: WritableMap) :
        Event<TopLoadingErrorEvent>(viewId) {
    companion object {
        const val EVENT_NAME = "topLoadingError"
    }

    override fun getEventName(): String = EVENT_NAME

    override fun canCoalesce(): Boolean = false

    override fun getCoalescingKey(): Short = 0

    override fun dispatch(rctEventEmitter: RCTEventEmitter) =
            rctEventEmitter.receiveEvent(viewTag, eventName, mEventData)

}
