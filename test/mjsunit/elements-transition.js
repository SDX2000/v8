// Copyright 2011 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --allow-natives-syntax --smi-only-arrays

support_smi_only_arrays = %HasFastSmiOnlyElements([]);

if (support_smi_only_arrays) {
  function test(test_double, test_object, set, length) {
    // We apply the same operations to two identical arrays.  The first array
    // triggers an IC miss, upon which the conversion stub is generated, but the
    // actual conversion is done in runtime.  The second array, arriving at
    // the previously patched IC, is then converted using the conversion stub.
    var array_1 = new Array(length);
    var array_2 = new Array(length);

    assertTrue(%HasFastSmiOnlyElements(array_1));
    assertTrue(%HasFastSmiOnlyElements(array_2));
    for (var i = 0; i < length; i++) {
      if (i == length - 8 && test_double) {
        set(array_1, i, 0.5);
        set(array_2, i, 0.5);
        assertTrue(%HasFastDoubleElements(array_1));
        assertTrue(%HasFastDoubleElements(array_2));
      } else if (i == length - 5 && test_object) {
        set(array_1, i, 'object');
        set(array_2, i, 'object');
        assertTrue(%HasFastElements(array_1));
        assertTrue(%HasFastElements(array_2));
      } else {
        set(array_1, i, 2*i+1);
        set(array_2, i, 2*i+1);
      }
    }

    for (var i = 0; i < length; i++) {
      if (i == length - 8 && test_double) {
        assertEquals(0.5, array_1[i]);
        assertEquals(0.5, array_2[i]);
      } else if (i == length - 5 && test_object) {
        assertEquals('object', array_1[i]);
        assertEquals('object', array_2[i]);
      } else {
        assertEquals(2*i+1, array_1[i]);
        assertEquals(2*i+1, array_2[i]);
      }
    }
  }

  test(false, false, function(a,i,v){ a[i] = v; }, 100);
  test(true,  false, function(a,i,v){ a[i] = v; }, 100);
  test(false, true,  function(a,i,v){ a[i] = v; }, 100);
  test(true,  true,  function(a,i,v){ a[i] = v; }, 100);

  test(false, false, function(a,i,v){ a[i] = v; }, 10000);
  test(true,  false, function(a,i,v){ a[i] = v; }, 10000);
  test(false, true,  function(a,i,v){ a[i] = v; }, 10000);
  test(true,  true,  function(a,i,v){ a[i] = v; }, 10000);
} else {
  print("Test skipped because smi only arrays are not supported.");
}