// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   DataAccess.java

package com.sgepit.frame.util;

import com.sgepit.frame.util.JNDIUtil;
import java.sql.*;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DataAccess
{

	public DataAccess()
	{
	}

	public static Connection getConnection(String location)
		throws NamingException, SQLException
	{
		InitialContext ctx = new InitialContext();
		DataSource ds = (DataSource)JNDIUtil.lookup(ctx, location);
		Connection con = ds.getConnection();
		return con;
	}

	public static void cleanUp(Connection con)
	{
		cleanUp(con, null, null);
	}

	public static void cleanUp(Connection con, Statement s)
	{
		cleanUp(con, s, null);
	}

	public static void cleanUp(Connection con, Statement s, ResultSet rs)
	{
		try
		{
			if (rs != null)
				rs.close();
		}
		catch (SQLException sqle)
		{
			sqle.printStackTrace();
		}
		try
		{
			if (s != null)
				s.close();
		}
		catch (SQLException sqle)
		{
			sqle.printStackTrace();
		}
		try
		{
			if (con != null)
				con.close();
		}
		catch (SQLException sqle)
		{
			sqle.printStackTrace();
		}
	}
}
