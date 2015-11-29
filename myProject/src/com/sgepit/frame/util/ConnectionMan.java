// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   ConnectionMan.java

package com.sgepit.frame.util;

import com.sgepit.frame.util.DataAccess;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.NamingException;

public class ConnectionMan
{

	public ConnectionMan()
	{
	}

	public static Connection getConnection()
	{
		try
		{
			return DataAccess.getConnection("jdbc/LiferayPool");
		}
		catch (NamingException e)
		{
			e.printStackTrace();
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		return null;
	}
}
