package com.sgepit.pmis.common;

import javax.servlet.http.HttpSession;

import com.sgepit.frame.base.Constant;

public class CommonUtilDwr {
	/**
	 * 变更登录用户的项目
	 * @param newPid
	 * @param newPname
	 * @param session
	 * @author: Ivy
	 * @createDate: May 7, 2011
	 */
	public void changeCurrentAppPid(String newPid, String newPname, HttpSession session){
		session.setAttribute(Constant.CURRENTAPPPID, newPid);
		session.setAttribute(Constant.CURRENTAPPPNAME, newPname);
	}
}
