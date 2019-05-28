//CLIENT-SIDE

class Player {
	constructor(id, name, rank)
	{
		this._id = id;
		this._name = name;
		this._rank = rank;
	}
	
	setName(name)
	{
		this._name = name;
    }
    
    getName()
    {
        return this._name;
    }
	
	setSID(sid)
	{
		this._SID = sid;
	}
	
	getID()
	{
		return this._id;
	}
}

