package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class FlwDwrRtnLog implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private boolean  flag;
	private boolean  hidden;
	private boolean  disabled;
	private boolean  success;
	private String   message;
	private Date     date;
	private String   errormsg;
	
	private String   _string1;
	private String   _string2;
	private String   _string3;
	private boolean  _b1;
	private boolean  _b2;
	private boolean  _b3;
	private Date     _date1;
	private Date     _date2;
	private Date     _date3;

    public FlwDwrRtnLog()
    {
    	this.success = true;
    	this.flag = false;
    }

	public boolean isFlag() {
		return flag;
	}

	public void setFlag(boolean flag) {
		this.flag = flag;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String get_string1() {
		return _string1;
	}

	public void set_string1(String _string1) {
		this._string1 = _string1;
	}

	public String get_string2() {
		return _string2;
	}

	public void set_string2(String _string2) {
		this._string2 = _string2;
	}

	public String get_string3() {
		return _string3;
	}

	public void set_string3(String _string3) {
		this._string3 = _string3;
	}

	public boolean is_b1() {
		return _b1;
	}

	public void set_b1(boolean _b1) {
		this._b1 = _b1;
	}

	public boolean is_b2() {
		return _b2;
	}

	public void set_b2(boolean _b2) {
		this._b2 = _b2;
	}

	public boolean is_b3() {
		return _b3;
	}

	public void set_b3(boolean _b3) {
		this._b3 = _b3;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date get_date1() {
		return _date1;
	}

	public void set_date1(Date _date1) {
		this._date1 = _date1;
	}

	public Date get_date2() {
		return _date2;
	}

	public void set_date2(Date _date2) {
		this._date2 = _date2;
	}

	public Date get_date3() {
		return _date3;
	}

	public void set_date3(Date _date3) {
		this._date3 = _date3;
	}

	public boolean isHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getErrormsg() {
		return errormsg;
	}

	public void setErrormsg(String errormsg) {
		this.errormsg = errormsg;
	}
}

