package com.sgepit.frame.util;

import javax.naming.Context;
import javax.naming.Name;
import javax.naming.NameNotFoundException;
import javax.naming.NamingException;

import com.sgepit.frame.base.Constant;

public class JNDIUtil {
	public static Object lookup(Context ctx) {
		String location = Constant.JndiName;
		Object obj = null;

		try {
			obj = ctx.lookup(location);
		}
		catch (NamingException n1) {

			// java:comp/env/ObjectName to ObjectName

			if (location.indexOf("java:comp/env/") != -1) {
				try {
					obj = ctx.lookup(
							location.replaceAll("java:comp/env/", ""));
				}
				catch (NamingException n2) {

					// java:comp/env/ObjectName to java:ObjectName

					try {
						obj = ctx.lookup(
								location.replaceAll("comp/env/", ""));
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}

			// java:ObjectName to ObjectName

			else if (location.indexOf("java:") != -1) {
				try {
					obj = ctx.lookup(location.replaceAll("java:", ""));
				}
				catch (NamingException n2) {

					// java:ObjectName to java:comp/env/ObjectName

					try {
						obj = ctx.lookup(location.replaceAll("java:", "java:comp/env/"));
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}

			// ObjectName to java:ObjectName

			else if (location.indexOf("java:") == -1) {
				try {
					obj = ctx.lookup("java:" + location);
				}
				catch (NamingException n2) {

					// ObjectName to java:comp/env/ObjectName

					try {
						obj = ctx.lookup("java:comp/env/" + location);
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}
			else {
				try {
					throw new NamingException();
				} catch (NamingException e) {
					System.out.println(e.getMessage());
				}
			}
		}

		return obj;
	}
	public static Object lookup(Context ctx, String location) {

		Object obj = null;

		try {
			obj = ctx.lookup(location);
		}
		catch (NamingException n1) {

			// java:comp/env/ObjectName to ObjectName

			if (location.indexOf("java:comp/env/") != -1) {
				try {
					obj = ctx.lookup(
							location.replaceAll("java:comp/env/", ""));
				}
				catch (NamingException n2) {

					// java:comp/env/ObjectName to java:ObjectName

					try {
						obj = ctx.lookup(
								location.replaceAll("comp/env/", ""));
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}

			// java:ObjectName to ObjectName

			else if (location.indexOf("java:") != -1) {
				try {
					obj = ctx.lookup(location.replaceAll("java:", ""));
				}
				catch (NamingException n2) {

					// java:ObjectName to java:comp/env/ObjectName

					try {
						obj = ctx.lookup(location.replaceAll("java:", "java:comp/env/"));
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}

			// ObjectName to java:ObjectName

			else if (location.indexOf("java:") == -1) {
				try {
					obj = ctx.lookup("java:" + location);
				}
				catch (NamingException n2) {

					// ObjectName to java:comp/env/ObjectName

					try {
						obj = ctx.lookup("java:comp/env/" + location);
					} catch (NamingException e) {
						System.out.println(e.getMessage());
					}
				}
			}
			else {
				try {
					throw new NamingException();
				} catch (NamingException e) {
					System.out.println(e.getMessage());
				}
			}
		}

		return obj;
	}

	public static void bind(Context ctx, String name, Object val)
			throws NamingException {
		Name n;
		for (n = ctx.getNameParser("").parse(name); n.size() > 1; n = n
				.getSuffix(1)) {
			String ctxName = n.get(0);
			try {
				ctx = (Context) ctx.lookup(ctxName);
			} catch (NameNotFoundException namenotfoundexception) {
				ctx = ctx.createSubcontext(ctxName);
			}
		}
		ctx.bind(n.get(0), val);
	}
}

/****tomcat*****/
/*Context ctx = new InitialContext();
System.out.println(ctx.lookup("java:comp/env/jdbc/LiferayPool"));//ϵͳ���õ�jndi��java:comp/env��ͷ
//readonly
try {
ctx.rebind("java:comp/env/jdbc/LiferayPool", "bbbb");//ϵͳjndi��ֻ�u�
System.out.println(ctx.lookup("java:comp/env/jdbc/LiferayPool"));
} catch (Exception e) {
	System.out.println(e.getMessage());
}
//
Context ctx1 = ctx.createSubcontext("jdbc");//�Լ��ﶨ��jndiû��java:��ͷ
ctx1.bind("LiferayPool", "cccc");
System.out.println(ctx.lookup("jdbc/LiferayPool"));*/

/****jboss*****/
/*Context ctx = new InitialContext();
System.out.println(ctx.lookup("java:jdbc/LiferayPool"));//ϵͳ���õ�jndi��java:��ͷ
//writeable
try {
ctx.rebind("java:jdbc/LiferayPool", "bbbb");
System.out.println(ctx.lookup("java:jdbc/LiferayPool"));
} catch (Exception e) {
	System.out.println(e.getMessage());
}
//
Context ctx1 = ctx.createSubcontext("jdbc");//�Լ��ﶨ��jndiû��java:��ͷ
ctx1.bind("LiferayPool", "cccc");
System.out.println(ctx.lookup("jdbc/LiferayPool"));*/

/****weblogic*****/
/*Context ctx = new InitialContext();
System.out.println(ctx.lookup("jdbc/LiferayPool"));//ϵͳ���õ�jndi�Կ�ͷ

//writeable
try {
ctx.rebind("jdbc/LiferayPool", "bbbb");
System.out.println(ctx.lookup("jdbc/LiferayPool"));
} catch (Exception e) {
	System.out.println(e.getMessage());
}

Context ctx1 = ctx.createSubcontext("jdbc");//�Լ��ﶨ��jndiû��java:��ͷ
ctx1.rebind("LiferayPool", "ddd");
System.out.println(ctx.lookup("jdbc/LiferayPool"));*/