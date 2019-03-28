class Event 
{
	constructor(eventname)
	{
		this.name = eventname;
		this.callbacks = [];
	}
	
	register(callback)
	{
		this.callbacks.push(callback);
	}
	
	fire(data)
	{
		for (var i = 0; i < this.callbacks.length; i++)
		{
			this.callbacks[i](data);
		}
	}
}

class EventHandler
{
	constructor()
	{
		this.events = [];
	}
	
	addEventListener(eventname, callback)
	{
		let eventobj = this.events[eventname];
		if (!eventobj)
		{
			eventobj = new Event(eventname);
			eventobj.register(callback);
			this.events[eventname] = eventobj;
			
		}
	}
	
	dispatchEvent(eventname, data)
	{
		let eventobj = this.events[eventname];
		if (eventobj)
		{
			eventobj.fire(data);
		}
	}
	
}